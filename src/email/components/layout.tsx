import { EmailGreeting } from '#/email/components/greeting.tsx'
import { EmailHeading } from '#/email/components/heading.tsx'
import { EmailLogo } from '#/email/components/logo.tsx'
import type { ReactNode } from 'react'
import { Body, Container, Head, Html, Preview, Tailwind } from 'react-email'

export const EmailLayout = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            fontFamily: {
              sans: ['Vazirmatn', 'Inter', 'sans-serif'],
            },
          },
        },
      }}
    >
      <Html lang="fa-IR" dir="rtl">
        <Head>
          <title>{title}</title>
          <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Vazirmatn:wght@100..900&display=swap');`}
          </style>
        </Head>
        <Preview>{title}</Preview>
        <Body dir="rtl" className="bg-gray-100 font-sans antialiased">
          <Container className="my-16 rounded-xl border border-gray-200 bg-white p-4">
            <EmailLogo />
            <EmailHeading text={title} />
            <EmailGreeting />
            {children}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
