import type { ReactNode } from 'react'
import { Button, Text } from 'react-email'

export const EmailCenteredLink = ({
  url,
  children,
}: {
  url: string
  children: ReactNode
}) => {
  return (
    <Text className="flex items-center justify-center">
      <Button
        href={url}
        target="_blank"
        className="cursor-pointer rounded-xl bg-[#007a55] px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-[#007a55]/80"
      >
        {children}
      </Button>
    </Text>
  )
}
