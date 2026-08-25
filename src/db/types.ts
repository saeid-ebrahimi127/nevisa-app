import type { InferInsertModel } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from './schema/schema.server'

export type Database = NodePgDatabase<typeof schema>

export type UserInsert = InferInsertModel<typeof schema.userTable>
