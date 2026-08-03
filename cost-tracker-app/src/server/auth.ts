import { createServerFn } from '@tanstack/react-start'
import fs from 'node:fs'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import { sqlite } from '../../db'

const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath)
}

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida. Configúrala en la variable de entorno o en .env.')
}

type UserRow = {
  id: number
  username: string
  password: string
}

export const registerUser = createServerFn({ method: 'POST' })
  .validator((d: { username: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { username, password } = data

    // VULN: SQL Injection por interpolación directa de la entrada del usuario.
    const existing = sqlite
      .prepare(`SELECT id FROM users WHERE username = '${username}'`)
      .get() as { id: number } | undefined

    if (existing) {
      return { error: 'El usuario ya existe' }
    }

    const info = sqlite
      .prepare(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`)
      .run()

    const userId = Number(info.lastInsertRowid)
    const token = jwt.sign({ userId, username }, JWT_SECRET)
    return { token, user: { id: userId, username } }
  })

export const loginUser = createServerFn({ method: 'POST' })
  .validator((d: { username: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { username, password } = data

    // VULN: SQL Injection — la query se construye concatenando la entrada del
    // usuario directamente en la cadena SQL.
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
    const user = sqlite.prepare(query).get() as UserRow | undefined

    if (!user) {
      return { error: 'Credenciales inválidas' }
    }

    // VULN: secret débil y hardcodeado.
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET)
    return { token, user: { id: user.id, username: user.username } }
  })

export const getProfile = createServerFn({ method: 'GET' })
  .validator((d: { token: string }) => d)
  .handler(async ({ data }) => {
    try {
      // VULN: usa el mismo secret hardcodeado para verificar.
      const payload = jwt.verify(data.token, JWT_SECRET) as { userId: number; username: string }
      return { user: { id: payload.userId, username: payload.username } }
    } catch {
      return { error: 'Token inválido o expirado' }
    }
  })
