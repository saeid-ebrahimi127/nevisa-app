import type { Database } from '#/db/types.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema/schema.server.ts'

let db: Database | null = null

export const getDb = (): Database => {
  if (!db) {
    db = drizzle(serverEnv.DATABASE_URL, { schema })
  }

  return db
}
