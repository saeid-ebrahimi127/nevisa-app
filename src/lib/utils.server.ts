import { serverEnv } from '#/lib/env/env.server.ts'
import { nanoid } from 'nanoid'
import { appendFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { isIP } from 'node:net'
import { resolve } from 'node:path'

const logDirPath = resolve(process.cwd(), 'log')
const appLogFilePath = resolve(logDirPath, 'app.log')

const ensureLogDirExists = async () => {
  await mkdir(logDirPath, { recursive: true })
}

export const writeAppLog = async ({ content }: { content: string }) => {
  await ensureLogDirExists()

  await appendFile(
    appLogFilePath,
    `${new Date().toLocaleString('fa-IR')}\n${content}\n`,
    'utf-8',
  )
}

export const devWipeAppLog = async () => {
  if (serverEnv.APP_ENV === 'production') {
    console.error("you can't wipe app's logs in production.")

    return
  }

  await ensureLogDirExists()

  await writeFile(appLogFilePath, '', 'utf-8')
}

export const getClientIP = (request: Request): string => {
  const headers = [
    'cf-connecting-ip',
    'true-client-ip',
    'fastly-client-ip',
    'x-real-ip',
    'x-client-ip',
    'x-forwarded-for',
  ]

  for (const header of headers) {
    const value = request.headers.get(header)

    if (!value) continue

    const ip = value.split(',')[0]?.trim()

    if (ip && isIP(ip)) {
      return ip
    }
  }

  return 'unknown'
}

const uploadsDirPath = resolve(process.cwd(), 'uploads')
const uploadsImagesDirPath = resolve(uploadsDirPath, 'images')

export const ensureUploadsImagesDirExists = async () => {
  await mkdir(uploadsImagesDirPath, { recursive: true })
}

export const storeImage = async (
  input: ConstructorParameters<typeof Bun.Image>[0],
  width: number,
  height?: number,
  options?: Bun.Image.ResizeOptions,
) => {
  const fileName = `${nanoid()}.webp`

  await ensureUploadsImagesDirExists()

  await new Bun.Image(input)
    .resize(width, height, options)
    .webp()
    .write(resolve(uploadsImagesDirPath, fileName))

  return { fileName }
}

export const deleteImage = async (path: string) => {
  if (path.startsWith(new URL('/api/image', serverEnv.APP_URL).toString())) {
    const fileName = path.split('/').at(-1)

    if (fileName) {
      await ensureUploadsImagesDirExists()

      await rm(resolve(uploadsImagesDirPath, fileName), { force: true })
    }
  }
}

export const getLocalImage = (fileName: string) => {
  return readFile(resolve(uploadsImagesDirPath, fileName))
}

export const devWipeAppUploads = async () => {
  if (serverEnv.APP_ENV === 'production') {
    console.error("you can't wipe app's uploads in production.")

    return
  }

  await Promise.all([
    rm(uploadsImagesDirPath, { recursive: true, force: true }),
  ])
}
