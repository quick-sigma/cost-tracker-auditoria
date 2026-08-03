import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
export { users, expenses } from './schema'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbFile = path.join(dataDir, 'cost-tracker.db')

export const sqlite = new Database(dbFile)
sqlite.pragma('journal_mode = WAL')

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'egreso',
    date TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`)

const expenseCols = sqlite.prepare(`PRAGMA table_info(expenses)`).all() as { name: string }[]
if (!expenseCols.some((c) => c.name === 'type')) {
  sqlite.exec(`ALTER TABLE expenses ADD COLUMN type TEXT NOT NULL DEFAULT 'egreso'`)
}

export const db = drizzle({ client: sqlite })
