import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
})

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  amount: real('amount').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull().default('egreso'),
  date: text('date').notNull(),
  createdAt: integer('created_at').notNull(),
})
