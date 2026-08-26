import { z } from 'zod'

export const nameZodSchema = z
  .string()
  .trim()
  .min(1, 'نام الزامی است.')
  .max(30, 'نام بیشتر از 30 حرف است.')
  .regex(
    /^[a-zA-Zآ-ی\s'._-]+$/,
    "موارد مجاز: حروف انگلیسی و فارسی ، فضای خالی ، . ، _ ، - و '",
  )
