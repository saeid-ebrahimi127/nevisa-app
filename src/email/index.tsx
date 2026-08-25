import MagicLink from '#/email/templates/magic-link.tsx'
import { serverEnv } from '#/lib/env/env.server.ts'
import { getNodemailer } from '#/lib/nodemailer.server.ts'
import { render } from 'react-email'

const sendMail = ({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) => {
  return getNodemailer().sendMail({
    to,
    subject,
    from: { name: serverEnv.APP_NAME, address: serverEnv.SMTP_FROM_ADDRESS },
    html,
    text,
  })
}

export const sendMagicLink = async ({
  to,
  url,
}: {
  to: string
  url: string
}) => {
  const magicLink = <MagicLink url={url} />

  const [html, text] = await Promise.all([
    render(magicLink),
    render(magicLink, { plainText: true }),
  ])

  return sendMail({ to, subject: 'لینک جادویی', html, text })
}
