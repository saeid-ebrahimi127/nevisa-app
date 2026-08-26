import { CustomAlertDialog } from '#/components/custom-alert-dialog.tsx'
import { CustomCard } from '#/components/custom-card.tsx'
import { AlertDialogTrigger } from '#/components/ui/alert-dialog.tsx'
import { Button } from '#/components/ui/button.tsx'
import { errorMessage, successMessage } from '#/lib/message.ts'
import { deleteMyAccount } from '#/serverfn/user.ts'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const AccountDeleteMyAccount = () => {
  const [isPending, setIsPending] = useState(false)

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const deleteMyAccountFn = useServerFn(deleteMyAccount)

  return (
    <CustomCard
      title={<h1>حذف حساب کاربری من</h1>}
      description={
        <p className="text-destructive">
          برای حذف حساب کاربری خود روی دکمه ی زیر کلیک کنید. این عملیات غیر قابل
          بازگشت است.
        </p>
      }
    >
      <CustomAlertDialog
        trigger={
          <AlertDialogTrigger asChild>
            <Button type="button" variant={'destructive'}>
              <TrashIcon />
              حذف حساب کاربری من
            </Button>
          </AlertDialogTrigger>
        }
        action={async () => {
          try {
            setIsPending(true)

            const result = await deleteMyAccountFn()

            if (result.errorMessage) {
              toast.error(result.errorMessage)

              return
            }

            queryClient.removeQueries()

            await navigate({ to: '/auth', replace: true }).then(() => {
              toast.success(successMessage.yourAccountDeleted)
            })
          } catch {
            toast.error(errorMessage.generic)
          } finally {
            setIsPending(false)
          }
        }}
        actionText="بله"
        actionPendingText="در حال حذف..."
        isPending={isPending}
        description="آیا مطمئن هستید می خواهید حساب کاربری خود را حذف کنید؟ این عملیات غیر قابل بازگشت است."
      />
    </CustomCard>
  )
}
