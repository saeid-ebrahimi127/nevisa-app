import { getBetterAuthSession } from '#/lib/session.server.ts'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

export const createRequireAuthMiddleware = (
  { throwError }: { throwError: boolean } = { throwError: true },
) => {
  return createMiddleware({ type: 'request' }).server(async ({ next }) => {
    const betterAuthSession = await getBetterAuthSession()

    if (!betterAuthSession) {
      if (throwError) throw redirect({ to: '/auth', replace: true })

      return new Response(undefined, { status: 401 })
    }

    const { user } = betterAuthSession

    return next({ context: { currentUser: { image: user.image } } })
  })
}
