import { getDb } from '#/db/index.server.ts'
import { userTable } from '#/db/schema/auth-schema.server.ts'
import { auth } from '#/lib/auth.server.ts'
import { errorMessage } from '#/lib/message.ts'
import { deleteImage } from '#/lib/utils.server.ts'
import { createRateLimiterMiddlewareForAuthenticatedUsers } from '#/middleware/rate-limiter.ts'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'

export const deleteMyAccount = createServerFn({ method: 'POST' })
  .middleware([
    createRateLimiterMiddlewareForAuthenticatedUsers({
      key: 'delete-my-account',
    }),
  ])
  .handler(
    async ({
      context: { rateLimiterErrorMessage, currentUser, currentSession },
    }) => {
      if (rateLimiterErrorMessage) {
        return { errorMessage: rateLimiterErrorMessage }
      }

      const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

      const isCurrentSessionFresh =
        new Date().getTime() <=
        new Date(currentSession.createdAt).getTime() + ONE_DAY_IN_MS

      if (!isCurrentSessionFresh) {
        return { errorMessage: errorMessage.actionNeedsReLogin }
      }

      await auth.api.revokeSessions({ headers: getRequestHeaders() })

      const userAvatar = currentUser.image

      const [deletedUser] = await getDb()
        .delete(userTable)
        .where(eq(userTable.id, currentUser.id))
        .returning({ id: userTable.id })

      if (!deletedUser) {
        return { errorMessage: errorMessage.failedDeletingMyAccount }
      }

      if (userAvatar) {
        await deleteImage(userAvatar)
      }

      return { errorMessage: null }
    },
  )
