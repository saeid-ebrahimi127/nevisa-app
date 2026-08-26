import {
  createTooManyRequestsErrorMessage,
  errorMessage,
} from '#/lib/message.ts'
import { createRateLimiter } from '#/lib/rate-limiter.server.ts'
import { getClientIP } from '#/lib/utils.server.ts'
import { createRequireAuthMiddleware } from '#/middleware/require-auth.ts'
import { createMiddleware } from '@tanstack/react-start'
import { RateLimiterRes } from 'rate-limiter-flexible'

export const createRateLimiterMiddlewareForAuthenticatedUsers = ({
  requireAuthMiddleware_throwError = true,
  key,
  duration = 60,
  points = 5,
}: {
  requireAuthMiddleware_throwError?: boolean
  key: string
  duration?: number
  points?: number
}) => {
  return createMiddleware({ type: 'request' })
    .middleware([
      createRequireAuthMiddleware({
        throwError: requireAuthMiddleware_throwError,
      }),
    ])
    .server(async ({ next, request, context: { currentUser } }) => {
      if (currentUser.role === 'super_admin')
        return next({ context: { rateLimiterErrorMessage: null } })

      let rateLimiterErrorMessage: string | null = null

      try {
        await createRateLimiter({ duration, points }).consume(
          `${key}:${getClientIP(request)}`,
        )
      } catch (error) {
        if (error instanceof RateLimiterRes) {
          rateLimiterErrorMessage = createTooManyRequestsErrorMessage(
            error.msBeforeNext,
          )
        } else {
          rateLimiterErrorMessage = errorMessage.generic
        }
      }

      return next({ context: { rateLimiterErrorMessage } })
    })
}
