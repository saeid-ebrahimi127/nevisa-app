import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog.tsx'
import { useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'

export const CustomAlertDialog = ({
  trigger,
  description,
  isPending,
  action,
  actionText,
  actionPendingText,
  variant = 'destructive',
}: {
  trigger: ReactNode
  description: ReactNode
  isPending: boolean
  action: () => Promise<void>
  actionText: string
  actionPendingText: string
  variant?: ComponentProps<typeof AlertDialogAction>['variant']
}) => {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تایید عملیات</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>انصراف</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            variant={variant}
            onClick={async (e) => {
              e.preventDefault()

              try {
                await action()
              } finally {
                setOpen(false)
              }
            }}
          >
            {isPending ? actionPendingText : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
