import { CustomAvatar } from '#/components/custom-avatar.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx'
import type { UserRole } from '#/lib/const.ts'
import { Link } from '@tanstack/react-router'
import { Loader2Icon, LogOutIcon, UserIcon } from 'lucide-react'

type LogoutProps = { isPending: boolean; handler: () => Promise<void> }

export const UserDropdown = ({
  user: { name, username, role, image },
  logout,
}: {
  user: { name: string; username: string; role: UserRole; image?: string }
  logout: LogoutProps
}) => {
  let roleTranslation = ''

  switch (role) {
    case 'subscriber':
      roleTranslation = 'کاربر عادی'
      break
    case 'super_admin':
      roleTranslation = 'سوپر ادمین'
      break
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CustomAvatar
          src={image || undefined}
          alt={`عکس کاربری ${name}`}
          fallback={name[0]!}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-54" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <CustomAvatar
              src={image || undefined}
              alt={`عکس کاربری ${name}`}
              fallback={name[0]!}
              className="size-10"
              fallbackClassName="text-base"
            />
            <div className="min-w-0 space-y-1">
              <div className="truncate text-sm text-black">{name}</div>
              <div className="truncate text-xs">{username}</div>
              <div className="truncate text-xs">{roleTranslation}</div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account">
              <UserIcon />
              حساب کاربری
            </Link>
          </DropdownMenuItem>
          <LogoutDropdownMenuItem logout={logout} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LogoutDropdownMenuItem = ({
  logout: { isPending, handler },
}: {
  logout: LogoutProps
}) => {
  return (
    <DropdownMenuItem
      disabled={isPending}
      variant="destructive"
      onSelect={async (e) => {
        e.preventDefault()

        await handler()
      }}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      {isPending ? 'در حال خروج...' : 'خروج'}
    </DropdownMenuItem>
  )
}
