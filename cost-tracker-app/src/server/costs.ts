import { createServerFn } from '@tanstack/react-start'
import { sqlite } from '../../db'

type ExpenseRow = {
  id: number
  user_id: number
  amount: number
  description: string
  category: string
  type: string
  date: string
  created_at: number
}

type ExpenseInput = {
  userId: number
  amount: number
  description: string
  category: string
  type: 'ingreso' | 'egreso'
}

const mapRow = (r: ExpenseRow) => ({
  id: r.id,
  userId: r.user_id,
  amount: r.amount,
  description: r.description,
  category: r.category,
  type: (r.type as 'ingreso' | 'egreso') ?? 'egreso',
  date: r.date,
})

export const createExpense = createServerFn({ method: 'POST' })
  .validator((d: ExpenseInput) => d)
  .handler(async ({ data }) => {
    const { userId, amount, description, category, type } = data
    const today = new Date().toISOString().slice(0, 10)

    // VULN: SQL Injection por interpolación de todos los campos del usuario.
    sqlite
      .prepare(
        `INSERT INTO expenses (user_id, amount, description, category, type, date, created_at)
         VALUES (${userId}, ${amount}, '${description}', '${category}', '${type}', '${today}', ${Date.now()})`,
      )
      .run()

    return { ok: true }
  })

export const listExpenses = createServerFn({ method: 'POST' })
  .validator((d: { userId: number; category?: string }) => d)
  .handler(async ({ data }) => {
    const { userId, category } = data

    // VULN: SQL Injection — la entrada del usuario (categoría) se concatena
    // directamente en la query sin parámetros ni escape.
    let query = `SELECT * FROM expenses WHERE user_id = ${userId}`
    if (category && category !== '') {
      query += ` AND category = '${category}'`
    }
    query += ' ORDER BY id DESC'

    const rows = sqlite.prepare(query).all() as ExpenseRow[]
    return {
      expenses: rows.map(mapRow),
    }
  })

export const updateExpense = createServerFn({ method: 'POST' })
  .validator(
    (d: { id: number; amount: number; description: string; category: string; type: 'ingreso' | 'egreso' }) =>
      d,
  )
  .handler(async ({ data }) => {
    const { id, amount, description, category, type } = data

    // VULN: SQL Injection en UPDATE.
    sqlite
      .prepare(
        `UPDATE expenses SET amount = ${amount}, description = '${description}', category = '${category}', type = '${type}' WHERE id = ${id}`,
      )
      .run()

    return { ok: true }
  })

export const deleteExpense = createServerFn({ method: 'POST' })
  .validator((d: { id: number }) => d)
  .handler(async ({ data }) => {
    // VULN: SQL Injection en DELETE por interpolación del id.
    sqlite.prepare(`DELETE FROM expenses WHERE id = ${data.id}`).run()
    return { ok: true }
  })
