import { getAppName } from '#/lib/my-utils.ts'
import { Link } from '@tanstack/react-router'
import { PencilLineIcon } from 'lucide-react'

export const Logo = () => {
  const appName = getAppName()

  return (
    <Link to="/" className="flex items-center gap-2">
      <PencilLineIcon className="text-primary size-5" />
      <span className="text-xl font-medium">{appName}</span>
    </Link>
  )
}
