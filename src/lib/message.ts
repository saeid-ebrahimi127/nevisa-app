import { createIsomorphicFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export const errorMessage = {
  INVALID_TOKEN: 'توکن نامعتبر است. دوباره درخواست توکن کنید.',
  TOKEN_EXPIRED: 'توکن منقضی شده است. دوباره درخواست توکن کنید.',
  generic: 'خطایی رخ داده است. دوباره تلاش کنید.',
  USERNAME_IS_ALREADY_TAKEN: 'نام کاربری مورد نظر قبلا استفاده شده است.',
  sessionInvalidOrExpired:
    'نشست شما نامعتبر بوده یا منقضی شده است. دوباره وارد شوید.',
  failedDeletingMyAccount: 'خطا در حذف حساب کاربری شما! دوباره تلاش کنید.',
  actionNeedsReLogin:
    'انجام این عملیات نیازمند ورود مجدد است. برای ادامه از حساب کاربری خود خارج شده و دوباره وارد شوید.',
  newEmailAndCurrentEmailAreEqual: 'ایمیل جدید و فعلی یکسان هستند.',
  emailIsAlreadyTaken: 'ایمیل مورد نظر قبلا استفاده شده است.',
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
  changesSaved: 'تغییرات ذخیره شد.',
  yourAvatarSaved: 'عکس کاربری شما ذخیره شد.',
  yourAvatarDeleted: 'عکس کاربری شما حذف شد.',
  yourAccountDeleted: 'حساب کاربری شما حذف شد.',
  emailVerificationSentToYourNewEmail:
    'پیامی حاوی لینک تایید به ایمیل جدید شما فرستاده شد. بدون تایید ، ایمیل شما تغییر نخواهد یافت.',
  emailChanged: 'ایمیل شما تغییر یافت.',
}

export type SuccessMessageKey = keyof typeof successMessage

export const createTooManyRequestsErrorMessage = (msBeforeNext: number) => {
  return `تعداد دفعات تلاش بیش از حد مجاز است. لطفا پس از ${Math.floor(msBeforeNext / 1000)} ثانیه ی دیگر مجددا تلاش نمایید.`
}
