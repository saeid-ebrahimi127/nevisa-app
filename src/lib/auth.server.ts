import { getDb } from '#/db/index.server.ts'
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from '#/db/schema/auth-schema.server.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  appName: serverEnv.APP_NAME,
  baseURL: serverEnv.BETTER_AUTH_BASE_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(getDb(), {
    provider: 'pg',
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [tanstackStartCookies()],
  advanced: {
    database: { generateId: false },
  },
  rateLimit: {
    enabled: false,
  },
})
