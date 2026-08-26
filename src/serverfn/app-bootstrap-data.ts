import type { UserRole } from '#/lib/const.ts'
import { getBetterAuthSession, getFlashMessage } from '#/lib/session.server.ts'
import { createServerFn } from '@tanstack/react-start'
import type { User } from 'better-auth'

export const getAppBootstrapData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [betterAuthSession, flashMessage] = await Promise.all([
      getBetterAuthSession(),
      getFlashMessage(),
    ])

    let user:
      | (Pick<User, 'name' | 'email' | 'image'> & {
          username: string
          role: UserRole
        })
      | null = null

    if (betterAuthSession) {
      const {
        user: { name, email, image, username, ...userRest },
      } = betterAuthSession

      user = { name, email, image, username, role: userRest.role as UserRole }
    }

    return { user, flashMessage }
  },
)
