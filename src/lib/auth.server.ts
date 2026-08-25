import { getDb } from '#/db/index.server.ts'
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from '#/db/schema/auth-schema.server.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import type { ErrorMessageKey, SuccessMessageKey } from '#/lib/message.ts'
import { errorMessage, successMessage } from '#/lib/message.ts'
import { getRedisClient } from '#/lib/redis.server.ts'
import { setFlashMessage } from '#/lib/session.server.ts'
import { writeAppLog } from '#/lib/utils.server.ts'
import { redisStorage } from '@better-auth/redis-storage'
import { betterAuth } from 'better-auth'
import { localization } from 'better-auth-localization'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAuthMiddleware } from 'better-auth/api'
import { magicLink } from 'better-auth/plugins'
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
  plugins: [
    localization({
      defaultLocale: 'fa-IR',
      fallbackLocale: 'default',
    }),
    magicLink({
      expiresIn: 5 * 60,
      storeToken: 'hashed',
      async sendMagicLink({ email, url }) {
        if (serverEnv.APP_ENV === 'production') {
        } else {
          await writeAppLog({
            content: `=== MAGIC LINK ===\n[email] ${email}\n[url]\n${url}\n`,
          })
        }
      },
    }),
    tanstackStartCookies(),
  ],
  advanced: {
    database: { generateId: false },
  },
  rateLimit: {
    enabled: false,
  },
  hooks: {
    after: createAuthMiddleware(async ({ context }) => {
      const returned = context.returned as { headers?: Headers } | null

      if (returned) {
        const location = returned.headers?.get('location')?.toString()

        if (location) {
          const error = new URL(location, serverEnv.APP_URL).searchParams
            .get('error')
            ?.toString()

          if (error) {
            const message = errorMessage[error as ErrorMessageKey] as
              string | undefined

            if (message) {
              await setFlashMessage({ type: 'error', text: message })
            }

            return
          }

          const success = new URL(location, serverEnv.APP_URL).searchParams
            .get('success')
            ?.toString()

          if (success) {
            const message = successMessage[success as SuccessMessageKey] as
              string | undefined

            if (message) {
              await setFlashMessage({ type: 'success', text: message })
            }
          }
        }
      }
    }),
  },
  verification: {
    disableCleanup: false,
    storeInDatabase: false,
    storeIdentifier: 'hashed',
  },
  secondaryStorage: redisStorage({
    client: getRedisClient(),
    keyPrefix: 'better-auth:',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        fieldName: 'role',
      },
    },
  },
})
