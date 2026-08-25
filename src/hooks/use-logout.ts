import { authClient } from '#/lib/auth-client.ts'
import {
  errorMessage,
  successMessage,
  toastBetterAuthError,
} from '#/lib/message.ts'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export const useLogout = () => {
  const [isPending, setIsPending] = useState(false)

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const handler = async () => {
    try {
      setIsPending(true)

      const { error } = await authClient.signOut()

      if (error) {
        toastBetterAuthError(error)

        return
      }

      queryClient.removeQueries()

      await navigate({ to: '/auth', replace: true }).then(() => {
        toast.success(successMessage.loggedOut)
      })
    } catch {
      toast.error(errorMessage.generic)
    } finally {
      setIsPending(false)
    }
  }

  return { isPending, handler }
}
