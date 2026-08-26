import { Loader2Icon } from 'lucide-react'

export const RoutePendingComponent = () => {
  return (
    <div className="text-muted-foreground flex items-center justify-center gap-1">
      <Loader2Icon className="size-4 animate-spin" />
      <div className="text-sm">در حال بارگذاری...</div>
    </div>
  )
}
