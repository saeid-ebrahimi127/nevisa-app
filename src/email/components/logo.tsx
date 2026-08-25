import { serverEnv } from '#/lib/env/env.server.ts'
import { PencilLineIcon } from 'lucide-react'
import { Button, Text } from 'react-email'

export const EmailLogo = () => {
  return (
    <Text className="flex items-center justify-center">
      <Button href={serverEnv.APP_URL} target="_blank">
        <span className="flex items-center gap-2 text-black">
          <PencilLineIcon className="size-5 text-[#007a55]" />
          <span className="text-xl font-medium">{serverEnv.APP_NAME}</span>
        </span>
      </Button>
    </Text>
  )
}
