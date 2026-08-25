import { serverEnv } from '#/lib/env/env.server.ts'
import { createTransport } from 'nodemailer'

type Nodemailer = ReturnType<typeof createTransport>

let nodemailer: Nodemailer | null = null

export const getNodemailer = (): Nodemailer => {
  if (!nodemailer) {
    nodemailer = createTransport({
      host: serverEnv.SMTP_HOST,
      port: serverEnv.SMTP_PORT,
      secure: serverEnv.SMTP_SECURE,
      auth:
        serverEnv.SMTP_USER && serverEnv.SMTP_PASS
          ? {
              user: serverEnv.SMTP_USER,
              pass: serverEnv.SMTP_PASS,
            }
          : undefined,
    })
  }

  return nodemailer
}
