import { auth } from '#/lib/auth.server.ts'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getBetterAuthSession = () => {
  return auth.api.getSession({ headers: getRequestHeaders() })
}
