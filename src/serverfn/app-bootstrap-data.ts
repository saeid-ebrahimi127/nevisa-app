import { getBetterAuthSession } from '#/lib/session.server.ts'
import { createServerFn } from '@tanstack/react-start'
import type { User } from 'better-auth'

export const getAppBootstrapData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const betterAuthSession = await getBetterAuthSession()

    let user: Pick<User, 'name'> | null = null

    if (betterAuthSession) {
      const {
        user: { name },
      } = betterAuthSession

      user = { name }
    }

    return { user }
  },
)
