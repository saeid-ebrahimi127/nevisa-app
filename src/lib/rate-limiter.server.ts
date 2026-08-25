import { getRedisClient } from '#/lib/redis.server.ts'
import { RateLimiterRedis } from 'rate-limiter-flexible'

export const createRateLimiter = ({
  duration,
  points,
}: {
  duration: number
  points: number
}) => {
  return new RateLimiterRedis({
    duration,
    points,
    storeClient: getRedisClient(),
    keyPrefix: 'rate-limiter',
  })
}
