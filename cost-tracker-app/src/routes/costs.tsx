import { useEffect, useMemo, useState } from 'react'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { createExpense, deleteExpense, listExpenses, updateExpense } from '../server/costs'
import { clearSession, getUser } from '../lib/auth'
import { DonutChart } from '../components/donut'

export const Route = createFileRoute('/costs')({
  component: Costs,
})

type Expense = {
  id: number
  userId: number
  amount: number
  description: string
  category: string
  type: 'ingreso' | 'egreso'
  date: string
}

const CATEGORIES = ['Comida', 'Transporte', 'Entretenimiento', 'Ropa', 'Hogar', 'Otros']
const PALETTE = ['#6c7cff', '#38e1b6', '#f59e0b', '#f87171', '#a78bfa', '#34d399', '#22d3ee', '#fb7185']

const money = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

function Costs() {
  const navigate = useNavigate()
  const router = useRouter()
  const user = getUser()

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [type, setType] = useState<'ingreso' | 'egreso'>('egreso')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    if (!user) return
    const res = await listExpenses({ data: { userId: user.id, category: categoryFilter } })
    if (res.expenses) setExpenses(res.expenses)
  }

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onFilterChange = async (value: string) => {
    setCategoryFilter(value)
    if (!user) return
    const res = await listExpenses({ data: { userId: user.id, category: value } })
    if (res.expenses) setExpenses(res.expenses)
  }

  const totals = useMemo(() => {
    const ingresos = expenses
      .filter((e) => e.type === 'ingreso')
      .reduce((s, e) => s + e.amount, 0)
    const egresos = expenses
      .filter((e) => e.type === 'egreso')
      .reduce((s, e) => s + e.amount, 0)
    return { ingresos, egresos, balance: ingresos - egresos }
  }, [expenses])

  const donut = useMemo(() => {
    const byCat = new Map<string, number>()
    for (const e of expenses) {
      if (e.type !== 'egreso') continue
      byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount)
    }
    const segments = [...byCat.entries()].map(([label, value], i) => ({
      label,
      value,
      color: PALETTE[i % PALETTE.length],
    }))
    return segments.sort((a, b) => b.value - a.value)
  }, [expenses])

  const donutTotal = donut.reduce((s, x) => s + x.value, 0)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)
    try {
      if (editingId) {
        await updateExpense({
          data: { id: editingId, amount: Number(amount), description, category, type },
        })
        setEditingId(null)
      } else {
        await createExpense({
          data: { userId: user.id, amount: Number(amount), description, category, type },
        })
      }
      setAmount('')
      setDescription('')
      setCategory(CATEGORIES[0])
      setType('egreso')
      await refresh()
    } catch {
      setError('Error al guardar el movimiento')
    }
  }

  const onDelete = async (id: number) => {
    await deleteExpense({ data: { id } })
    await refresh()
  }

  const startEdit = (exp: Expense) => {
    setEditingId(exp.id)
    setAmount(String(exp.amount))
    setDescription(exp.description)
    setCategory(exp.category)
    setType(exp.type)
  }

  const onLogout = () => {
    clearSession()
    router.invalidate()
    navigate({ to: '/' })
  }

  return (
    <main>
      <div className="topbar">
        <div className="brand">
          <span className="dot" />{' '}
          Cost Tracker
        </div>
        <div className="row">
          <span className="chip">{user?.username}</span>
          <Link to="/">
            <button className="secondary small">Inicio</button>
          </Link>
          <button className="secondary small" onClick={onLogout}>
            Salir
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats">
        <div className="card stat">
          <div className="val pos">+{money(totals.ingresos)}</div>
          <div className="lbl">Ingresos</div>
        </div>
        <div className="card stat">
          <div className="val neg">-{money(totals.egresos)}</div>
          <div className="lbl">Egresos</div>
        </div>
        <div className="card stat">
          <div className={`val ${totals.balance >= 0 ? 'pos' : 'neg'}`}>{money(totals.balance)}</div>
          <div className="lbl">Balance</div>
        </div>
      </div>

      <div className="dashboard">
        <div>
          <div className="card">
            <h3>{editingId ? 'Editar movimiento' : 'Nuevo movimiento'}</h3>
            <form onSubmit={onSubmit}>
              <div className="toggle">
                <button
                  type="button"
                  className={type === 'egreso' ? 'active-egreso' : ''}
                  onClick={() => setType('egreso')}
                >
                  − Egreso
                </button>
                <button
                  type="button"
                  className={type === 'ingreso' ? 'active-ingreso' : ''}
                  onClick={() => setType('ingreso')}
                >
                  + Ingreso
                </button>
              </div>
              <label>
                Monto{' '}
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </label>
              <label>
                Descripción{' '}
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Suscripción Netflix"
                  required
                />
              </label>
              <label>
                Categoría{' '}
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="row" style={{ justifyContent: 'flex-start' }}>
                <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar'}</button>
                {editingId && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setEditingId(null)
                      setAmount('')
                      setDescription('')
                      setCategory(CATEGORIES[0])
                      setType('egreso')
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h3>Filtro por categoría</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void onFilterChange(categoryFilter)
              }}
            >
              <label>
                Categoría{' '}
                <input
                  value={categoryFilter}
                  onChange={(e) => onFilterChange(e.target.value)}
                  placeholder="Ej. Comida"
                />
              </label>
              <div className="row" style={{ justifyContent: 'flex-start' }}>
                <button type="submit">Filtrar</button>
                {categoryFilter && (
                  <button type="button" className="secondary" onClick={() => onFilterChange('')}>
                    Limpiar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h3>Movimientos</h3>
            {expenses.length === 0 ? (
              <p className="muted">No hay movimientos.</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="expense">
                  <div>
                    <span className={`amount ${exp.type === 'ingreso' ? 'pos' : 'neg'}`}>
                      {exp.type === 'ingreso' ? '+' : '-'}
                      {money(exp.amount)}
                    </span>{' '}
                    {exp.description}
                    <div className="muted" style={{ marginTop: '.15rem' }}>
                      <span className={`tag ${exp.type}`}>{exp.type}</span>{' '}
                      <span className="tag">{exp.category}</span> · {exp.date}
                    </div>
                  </div>
                  <div className="row">
                    <button className="secondary small" onClick={() => startEdit(exp)}>
                      Editar
                    </button>
                    <button className="danger small" onClick={() => onDelete(exp.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3>Egresos por categoría</h3>
          {donut.length === 0 ? (
            <p className="muted">Sin datos para mostrar.</p>
          ) : (
            <div className="donut-wrap">
              <DonutChart
                segments={donut}
                centerValue={money(donutTotal).replace(/[\u00a0\s]/g, ' ')}
                centerLabel="egresos"
              />
              <div className="legend">
                {donut.map((seg) => (
                  <div key={seg.label} className="item">
                    <span className="swatch" style={{ background: seg.color }} />
                    <span className="lbl">{seg.label}</span>
                    <span className="pct">
                      {Math.round((seg.value / donutTotal) * 100)}%
                    </span>
                    <span className="amt">{money(seg.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
