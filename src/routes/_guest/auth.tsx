import { CustomCard } from '#/components/custom-card.tsx'
import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { TextInput } from '#/components/text-input.tsx'
import { FieldGroup } from '#/components/ui/field.tsx'
import { authClient } from '#/lib/auth-client.ts'
import { pageTitle } from '#/lib/head.ts'
import {
  errorMessage,
  successMessage,
  toastBetterAuthError,
} from '#/lib/message.ts'
import { emailZodSchema } from '#/zod-schema/email.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/_guest/auth')({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('ثبت نام یا ورود') }] }
  },
})

function RouteComponent() {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: emailZodSchema,
      }),
    ),
    defaultValues: {
      email: '',
    },
  })

  return (
    <div className="mx-auto my-16 max-w-sm">
      <CustomCard
        title={<h1>ثبت نام یا ورود</h1>}
        description="ایمیل خود را وارد کنید تا پیامی حاوی لینک جادویی برای شما ارسال شود."
      >
        <form
          onSubmit={form.handleSubmit(async (data) => {
            try {
              const { error } = await authClient.signIn.magicLink({
                ...data,
                name: '',
                callbackURL: '/?success=loggedIn',
                newUserCallbackURL: '/?success=newUser',
                errorCallbackURL: '/auth',
              })

              if (error) {
                toastBetterAuthError(error)

                return
              }

              form.reset()

              toast.success(successMessage.magicLinkSent)
            } catch {
              toast.error(errorMessage.generic)
            }
          })}
        >
          <FieldGroup>
            <TextInput
              control={form.control}
              name="email"
              inputProps={{
                type: 'email',
                autoComplete: 'on',
                placeholder: 'ایمیل',
              }}
              autoFocus
            />
            <LoadingSwapBtn
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              ارسال لینک جادویی
            </LoadingSwapBtn>
          </FieldGroup>
        </form>
      </CustomCard>
    </div>
  )
}
