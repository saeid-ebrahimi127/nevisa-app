import { Button } from '#/components/ui/button.tsx'
import { Link } from '@tanstack/react-router'
import { HomeIcon, SearchXIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export const NotFound = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-destructive mt-3 text-xl font-medium">
        صفحه ی مورد نظر یافت نشد.
      </h1>
      <div className="mt-3">
        {children || (
          <Button asChild>
            <Link to="/">
              <HomeIcon />
              بازگشت به خانه
            </Link>
          </Button>
        )}
      </div>
      <SearchXIcon className="text-destructive -order-1" />
    </div>
  )
}
