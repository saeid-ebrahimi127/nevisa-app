import { Button } from '#/components/ui/button.tsx'
import { LoadingSwap } from '#/components/ui/loading-swap.tsx'
import type { ComponentProps } from 'react'

export const LoadingSwapBtn = ({
  children,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <LoadingSwap isLoading={Boolean(props.disabled)}>{children}</LoadingSwap>
    </Button>
  )
}
