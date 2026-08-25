import { createIsomorphicFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export const errorMessage = {
  INVALID_TOKEN: 'توکن نامعتبر است. دوباره درخواست توکن کنید.',
  TOKEN_EXPIRED: 'توکن منقضی شده است. دوباره درخواست توکن کنید.',
  generic: 'خطایی رخ داده است. دوباره تلاش کنید.',
}

export type ErrorMessageKey = keyof typeof errorMessage

export const toastBetterAuthError = createIsomorphicFn()
  .client((error: { code?: string; message?: string }) => {
    toast.error(
      (error.code && errorMessage[error.code as ErrorMessageKey]) ||
        error.message ||
        errorMessage.generic,
    )
  })
  .server(() => undefined)

export const successMessage = {
  magicLinkSent: 'ایمیل حاوی لینک جادویی برای شما ارسال شد.',
  newUser: 'ثبت نام انجام شد. خوش آمدید.',
  loggedIn: 'شما وارد شدید.',
  loggedOut: 'شما خارج شدید.',
}

export type SuccessMessageKey = keyof typeof successMessage
