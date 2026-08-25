import { clientEnv } from '#/lib/env/env.client.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { createIsomorphicFn } from '@tanstack/react-start'

export const getAppName = createIsomorphicFn()
  .client(() => {
    return clientEnv.VITE_APP_NAME
  })
  .server(() => {
    return serverEnv.APP_NAME
  })
