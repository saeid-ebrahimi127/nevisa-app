import { serverEnv } from '#/lib/env/env.server.ts'
import { Redis } from 'ioredis'

let redisClient: Redis | null = null

const keyPrefix = `${serverEnv.APP_NAME}:`

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(serverEnv.REDIS_URL, {
      keyPrefix,
      lazyConnect: false,
      enableReadyCheck: true,
      enableOfflineQueue: true,
    })

    redisClient.on('connect', () => console.log('[Redis] connect.'))
    redisClient.on('ready', () => console.log('[Redis] ready.'))
    redisClient.on('error', (error) => console.error('[Redis] error:', error))
  }

  return redisClient
}

export async function devClearAppRedisCache() {
  if (serverEnv.APP_ENV === 'production') {
    console.error("[Redis] you can't clear app's redis cache in production.")

    return
  }

  const redis = getRedisClient()

  if (redis.status !== 'ready') {
    await new Promise<void>((resolve) => {
      redis.once('ready', resolve)
    })
  }

  const keys: string[] = []

  let cursor = '0'

  do {
    const [nextCursor, batch] = await redis.scan(
      cursor,
      'MATCH',
      `${keyPrefix}*`,
      'COUNT',
      100,
    )

    cursor = nextCursor

    keys.push(...batch)
  } while (cursor !== '0')

  if (keys.length === 0) {
    console.log('[Redis] no cache keys to clear.')

    return
  }

  const unprefixedKeys = keys.map((k) => k.slice(keyPrefix.length))

  await redis.del(...unprefixedKeys)

  console.log(`[Redis] cleared ${keys.length} cache key(s):`, keys)
}
