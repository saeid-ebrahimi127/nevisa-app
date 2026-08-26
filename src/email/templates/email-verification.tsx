import { EmailCenteredLink } from '#/email/components/centered-link.tsx'
import { EmailDisclaimer } from '#/email/components/disclaimer.tsx'
import { EmailExpiryNotice } from '#/email/components/expiry-notice.tsx'
import { EmailLayout } from '#/email/components/layout.tsx'
import { Hr, Text } from 'react-email'

const title = 'تایید ایمیل'

export default function EmailVerification({ url }: { url: string }) {
  return (
    <EmailLayout title={title}>
      <Text>برای تایید ایمیل روی دکمه ی (لینک) زیر کلیک کنید.</Text>
      <EmailCenteredLink url={url}>{title}</EmailCenteredLink>
      <EmailExpiryNotice minutes={30} />
      <Hr />
      <EmailDisclaimer />
    </EmailLayout>
  )
}
