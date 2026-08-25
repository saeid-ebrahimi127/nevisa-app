import type { auth } from '#/lib/auth.server.ts'
import {
  inferAdditionalFields,
  magicLinkClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
})
