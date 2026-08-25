import { Logo } from '#/components/logo.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'
import { Link, useRouteContext } from '@tanstack/react-router'
import { UserKey } from 'lucide-react'

export const Header = () => {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <header className="sticky top-0 flex h-(--header-height) items-center justify-between gap-4 border-b bg-white p-4 px-8">
      <Logo />
      {user ? null : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant={'outline'} size={'icon'}>
              <Link to="/auth">
                <UserKey />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent align="end">ثبت نام یا ورود</TooltipContent>
        </Tooltip>
      )}
    </header>
  )
}
