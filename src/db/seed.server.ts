import { getDb } from '#/db/index.server.ts'
import { userTable, verificationTable } from '#/db/schema/auth-schema.server.ts'
import type { UserInsert } from '#/db/types.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { devClearAppRedisCache } from '#/lib/redis.server.ts'
import { devWipeAppLog } from '#/lib/utils.server.ts'

if (serverEnv.APP_ENV === 'production') {
  console.error("you can't run seed in production.")

  process.exit(0)
}

try {
  await devClearAppRedisCache()

  console.log("wiping app's logs...")
  await devWipeAppLog()
  console.log("app's logs wiped.")

  console.log('wiping tables...')
  await Promise.all([
    getDb().delete(verificationTable),
    getDb().delete(userTable),
  ])
  console.log('tables wiped.')

  const seedStart = new Date('2024-08-17T08:42:00.000Z')
  const userStepMs = 60 * 60 * 1000 // 1 hour apart

  console.log('seeding users...')
  const userSeeds: UserInsert[] = [
    {
      name: 'سعید',
      email: 'saeid@example.com',
      emailVerified: true,
      role: 'super_admin',
      username: 'saeid123',
    },
    {
      name: 'dave',
      email: 'dave@example.com',
      emailVerified: true,
      username: 'dave123',
    },
  ]

  const users = await getDb()
    .insert(userTable)
    .values(
      userSeeds.map((u, i) => {
        const createdAt = new Date(seedStart.getTime() + i * userStepMs)

        return {
          ...u,
          createdAt,
          updatedAt: createdAt,
        }
      }),
    )
    .returning()

  if (users.length !== 2) throw new Error('failed to seed 2 users.')

  console.log('seeded users:', users.length)

  process.exit(0)
} catch (e) {
  console.error(e)

  process.exit(1)
}
