import { z } from 'zod'

export const usernameZodSchema = z
  .string()
  .trim()
  .min(3, 'نام کاربری حداقل باید 3 حرف باشد.')
  .max(20, 'نام کاربری بیشتر از 20 حرف است.')
  .regex(/^[a-z0-9_-]+$/, 'موارد مجاز: حروف کوچک انگلیسی ، اعداد ، _ و -')
