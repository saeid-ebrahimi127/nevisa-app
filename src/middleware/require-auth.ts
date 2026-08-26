import type { UserRole } from '#/lib/const.ts'
import { getBetterAuthSession } from '#/lib/session.server.ts'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

export const createRequireAuthMiddleware = ({
  throwError = true,
}: {
  throwError?: boolean
}) => {
  return createMiddleware({ type: 'request' }).server(async ({ next }) => {
    const betterAuthSession = await getBetterAuthSession()

    if (!betterAuthSession) {
      if (throwError) throw redirect({ to: '/auth', replace: true })

      return new Response(undefined, { status: 401 })
    }

    const { user, session } = betterAuthSession

    return next({
      context: {
        currentUser: {
          id: user.id,
          image: user.image,
          role: user.role as UserRole,
        },
        currentSession: {
          createdAt: session.createdAt,
        },
      },
    })
  })
}
