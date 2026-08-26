import type { UserRole } from '#/lib/const.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import {
  createTooManyRequestsErrorMessage,
  errorMessage,
} from '#/lib/message.ts'
import { createRateLimiter } from '#/lib/rate-limiter.server.ts'
import { getBetterAuthSession, setFlashMessage } from '#/lib/session.server.ts'
import { getClientIP } from '#/lib/utils.server.ts'
import { APIError } from 'better-auth'
import { RateLimiterRes } from 'rate-limiter-flexible'

type RateLimitOptions = {
  duration: number
  points: number
}

export function handleBetterAuthRateLimiting(
  key: string,
  request: Request,
  options?: RateLimitOptions,
  throwError?: true,
): Promise<undefined>

export function handleBetterAuthRateLimiting(
  key: string,
  request: Request,
  options: RateLimitOptions | undefined,
  throwError: false,
  redirectTo: string,
): Promise<Response | undefined>

export async function handleBetterAuthRateLimiting(
  key: string,
  request: Request,
  { duration, points }: RateLimitOptions = {
    duration: 60,
    points: 5,
  },
  throwError = true,
  redirectTo?: string,
): Promise<Response | undefined> {
  try {
    const betterAuthSession = await getBetterAuthSession()

    if (betterAuthSession?.user) {
      const { role } = betterAuthSession.user as { role: UserRole }

      if (role === 'super_admin') return
    }

    await createRateLimiter({ duration, points }).consume(
      `${key}:${getClientIP(request)}`,
    )
  } catch (error) {
    const isRateLimitError = error instanceof RateLimiterRes

    const status = isRateLimitError
      ? 'TOO_MANY_REQUESTS'
      : 'INTERNAL_SERVER_ERROR'

    const message = isRateLimitError
      ? createTooManyRequestsErrorMessage(error.msBeforeNext)
      : errorMessage.generic

    if (throwError) {
      throw new APIError(status, { message })
    }

    if (!redirectTo) {
      throw new Error(
        'handleBetterAuthRateLimiting: redirectTo is required when throwError is false',
      )
    }

    await setFlashMessage({
      type: 'error',
      text: message,
    })

    return new Response(undefined, {
      status: 303,
      headers: {
        location: new URL(redirectTo, serverEnv.APP_URL).toString(),
      },
    })
  }

  return undefined
}
