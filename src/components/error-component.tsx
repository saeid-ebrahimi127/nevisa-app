import { Button } from '#/components/ui/button.tsx'
import { Link } from '@tanstack/react-router'
import { HomeIcon, RotateCwIcon, XCircleIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export const ErrorComponent = ({
  children,
  reset,
}: {
  children?: ReactNode
  reset: () => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-destructive mt-3 text-xl font-medium">
        خطایی رخ داده است.
      </h1>
      <div className="xs:flex-row mt-3 flex flex-col items-center justify-center gap-2">
        <Button type="button" onClick={reset} variant={'outline'}>
          <RotateCwIcon />
          تلاش دوباره
        </Button>
        {children || (
          <Button asChild>
            <Link to="/">
              <HomeIcon />
              بازگشت به خانه
            </Link>
          </Button>
        )}
      </div>
      <XCircleIcon className="text-destructive -order-1" />
    </div>
  )
}
