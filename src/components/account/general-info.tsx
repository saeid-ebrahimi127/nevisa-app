import { CustomCard } from '#/components/custom-card.tsx'
import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { TextInput } from '#/components/text-input.tsx'
import { Button } from '#/components/ui/button.tsx'
import { FieldGroup } from '#/components/ui/field.tsx'
import { authClient } from '#/lib/auth-client.ts'
import {
  errorMessage,
  successMessage,
  toastBetterAuthError,
} from '#/lib/message.ts'
import { nameZodSchema } from '#/zod-schema/name.ts'
import { usernameZodSchema } from '#/zod-schema/username.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const AccountGeneralInfo = () => {
  const {
    currentUser: { name, username },
  } = useRouteContext({ from: '/_backend' })

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: nameZodSchema,
        username: usernameZodSchema,
      }),
    ),
    defaultValues: {
      name,
      username,
    },
  })

  const router = useRouter()

  return (
    <CustomCard
      title={<h1>اطلاعات عمومی</h1>}
      description="اطلاعات عمومی خود را اینجا بروزرسانی کنید."
    >
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            const { error } = await authClient.updateUser(data)

            if (error) {
              toastBetterAuthError(error)

              return
            }

            form.resetField('name', { defaultValue: data.name })
            form.resetField('username', { defaultValue: data.username })

            toast.success(successMessage.changesSaved)

            router.invalidate({
              filter(r) {
                return r.routeId === '__root__'
              },
            })
          } catch {
            toast.error(errorMessage.generic)
          }
        })}
      >
        <FieldGroup>
          <TextInput
            control={form.control}
            name="name"
            label="نام"
            inputProps={{
              type: 'text',
              autoComplete: 'on',
              className: 'max-w-sm',
            }}
            autoFocus
          />
          <TextInput
            control={form.control}
            name="username"
            label="نام کاربری"
            inputProps={{
              type: 'text',
              autoComplete: 'on',
              className: 'max-w-sm',
            }}
          />
          <div className="mr-auto flex items-center gap-2">
            <Button
              type="button"
              disabled={form.formState.isSubmitting}
              variant={'outline'}
              onClick={() => {
                form.reset()
              }}
            >
              پاک کردن
            </Button>
            <LoadingSwapBtn
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              ذخیره
            </LoadingSwapBtn>
          </div>
        </FieldGroup>
      </form>
    </CustomCard>
  )
}
