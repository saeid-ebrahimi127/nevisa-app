import { z } from 'zod'

export const emailZodSchema = z
  .string()
  .trim()
  .email('ایمیل معتبر الزامی است.')
  .max(50, 'ایمیل بیشتر از 50 حرف است.')
  .refine(
    (value) => value === value.toLowerCase(),
    'ایمیل فقط باید حاوی حروف کوچک باشد.',
  )
