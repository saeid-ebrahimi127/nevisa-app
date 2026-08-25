import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'
import { cn } from '#/lib/utils.ts'

export const UserAvatar = ({
  user: { name, image },
  className,
  fallbackClassName,
}: {
  user: { name: string; image?: string }
  className?: string
  fallbackClassName?: string
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={image} alt={`عکس کاربری ${name}`} />
      <AvatarFallback
        className={cn('bg-primary text-white capitalize', fallbackClassName)}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
