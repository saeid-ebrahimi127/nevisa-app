import { CustomCard } from '#/components/custom-card.tsx'
import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { TextInput } from '#/components/text-input.tsx'
import { FieldGroup } from '#/components/ui/field.tsx'
import { authClient } from '#/lib/auth-client.ts'
import {
  errorMessage,
  successMessage,
  toastBetterAuthError,
} from '#/lib/message.ts'
import { emailZodSchema } from '#/zod-schema/email.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouteContext } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const AccountEmail = () => {
  const {
    currentUser: { email: currentEmail },
  } = useRouteContext({ from: '/_backend' })

  const form = useForm({
    resolver: zodResolver(
      z.object({
        newEmail: emailZodSchema,
      }),
    ),
    defaultValues: {
      newEmail: '',
    },
  })

  return (
    <CustomCard
      title={<h1>ایمیل کاربری</h1>}
      description="برای تغییر ابتدا ایمیل جدید خود را وارد کنید. پیامی حاوی لینک تایید به این ایمیل فرستاده خواهد شد. بدون تایید ، ایمیل شما تغییر نخواهد کرد."
    >
      <p className="mb-6">ایمیل فعلی: {currentEmail}</p>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          if (data.newEmail === currentEmail) {
            toast.error(errorMessage.newEmailAndCurrentEmailAreEqual)

            return
          }

          try {
            const { error } = await authClient.changeEmail({
              ...data,
              callbackURL: '/account?tab=email&success=emailChanged',
            })

            if (error) {
              toastBetterAuthError(error)

              return
            }

            form.reset()

            toast.success(successMessage.emailVerificationSentToYourNewEmail)
          } catch {
            toast.error(errorMessage.generic)
          }
        })}
      >
        <FieldGroup>
          <TextInput
            control={form.control}
            name="newEmail"
            inputProps={{
              type: 'email',
              placeholder: 'ایمیل جدید',
              className: 'max-w-sm',
              autoComplete: 'on',
            }}
            autoFocus
          />
          <div className="mr-auto flex items-center gap-2">
            <LoadingSwapBtn
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              ارسال ایمیل حاوی لینک تایید
            </LoadingSwapBtn>
          </div>
        </FieldGroup>
      </form>
    </CustomCard>
  )
}
