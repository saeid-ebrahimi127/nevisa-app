import { errorMessage } from '#/lib/message.ts'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export const useAxiosErrorHandler = () => {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const handler = async (e: AxiosError) => {
    const { response } = e

    if (response) {
      const { status } = response

      if (status === 401) {
        queryClient.removeQueries()

        await navigate({ to: '/auth', replace: true }).then(() => {
          toast.error(errorMessage.sessionInvalidOrExpired)
        })

        return
      }

      if (
        typeof response.data === 'object' &&
        response.data !== null &&
        'errorMessage' in response.data &&
        typeof response.data.errorMessage === 'string'
      ) {
        const { errorMessage } = response.data

        toast.error(errorMessage)

        return
      }
    }

    toast.error(errorMessage.generic)
  }

  return { handler }
}
