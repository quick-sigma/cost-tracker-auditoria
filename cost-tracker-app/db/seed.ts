import { sqlite } from './index'

const admin = sqlite
  .prepare(`SELECT id FROM users WHERE username = 'admin'`)
  .get() as { id: number } | undefined

if (!admin) {
  const info = sqlite
    .prepare(`INSERT INTO users (username, password) VALUES ('admin', 'admin123')`)
    .run()
  const adminId = Number(info.lastInsertRowid)

  const insert = sqlite.prepare(`
    INSERT INTO expenses (user_id, amount, description, category, type, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const rows: [number, number, string, string, string, string][] = [
    [adminId, 54.9, 'Suscripción Netflix', 'Entretenimiento', 'egreso', '2026-07-01'],
    [adminId, 12.0, 'Almuerzo oficina', 'Comida', 'egreso', '2026-07-02'],
    [adminId, 199.99, 'Zapatillas running', 'Ropa', 'egreso', '2026-07-03'],
    [adminId, 1500.0, 'Nómina julio', 'Otros', 'ingreso', '2026-07-01'],
    [adminId, 45.0, 'Venta de monitor', 'Otros', 'ingreso', '2026-07-05'],
  ]
  for (const [uid, amount, description, category, type, date] of rows) {
    insert.run(uid, amount, description, category, type, date, Date.now())
  }
  console.log('Seed creado: usuario admin/admin123 + 5 movimientos (2 ingresos, 3 egresos)')
} else {
  const insert = sqlite.prepare(`
    INSERT INTO expenses (user_id, amount, description, category, type, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const ingresoCount = sqlite
    .prepare(`SELECT COUNT(*) AS n FROM expenses WHERE type = 'ingreso'`)
    .get() as { n: number }

  if (ingresoCount.n === 0) {
    const rows: [number, number, string, string, string, string][] = [
      [admin.id, 1500.0, 'Nómina julio', 'Otros', 'ingreso', '2026-07-01'],
      [admin.id, 45.0, 'Venta de monitor', 'Otros', 'ingreso', '2026-07-05'],
    ]
    for (const [uid, amount, description, category, type, date] of rows) {
      insert.run(uid, amount, description, category, type, date, Date.now())
    }
    console.log('Seed actualizado: ingresos de ejemplo creados')
  } else {
    console.log('Seed omitido: el usuario admin ya tiene movimientos')
  }
}
