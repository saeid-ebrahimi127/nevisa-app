import {
  accountTable,
  sessionTable,
  userTable,
} from '#/db/schema/auth-schema.server.ts'
import { relations } from 'drizzle-orm'

export * from './auth-schema.server'

export const userTableRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  accounts: many(accountTable),
}))

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const accountTableRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}))
