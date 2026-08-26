import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar.tsx'
import { cn } from '#/lib/utils.ts'

export const CustomAvatar = ({
  className,
  src,
  alt,
  fallbackClassName,
  fallback,
}: {
  className?: string
  src: string | undefined
  alt: string
  fallbackClassName?: string
  fallback: string
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback
        className={cn('bg-primary text-white capitalize', fallbackClassName)}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  )
}
