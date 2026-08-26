import { z } from 'zod'

export const createImageZodSchema = (
  {
    maxSizeInBytes,
    validMimes,
  }: { maxSizeInBytes: number; validMimes: string[] } = {
    maxSizeInBytes: 2 * 1024 * 1024,
    validMimes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
) => {
  const maxSizeInMB = maxSizeInBytes / 1024 / 1024
  const prettyValidTypes = validMimes
    .map((mime) => mime.split('/')[1])
    .join(' ، ')

  const schema = z
    .instanceof(File, { error: 'فایلی انتخاب نشده است.' })
    .refine((file) => {
      return file.size > 0
    }, 'فایل خالی است.')
    .refine((file) => {
      return file.size <= maxSizeInBytes
    }, `فایل بیشتر از ${maxSizeInMB} مگابایت است.`)
    .refine((file) => {
      return validMimes.includes(file.type)
    }, `موارد مجاز: ${prettyValidTypes}`)

  return {
    inputFileAccept: validMimes.join(','),
    maxSizeInMB,
    prettyValidTypes,
    schema,
  }
}

export const avatarZodSchema = createImageZodSchema()

export const imageFileNameZodSchema = z
  .string()
  .trim()
  .regex(
    /^[A-Za-z0-9_-]{21}\.webp$/,
    'Must be a valid nanoid filename with .webp extension',
  )
