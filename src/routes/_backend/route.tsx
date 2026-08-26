import { RoutePendingComponent } from '#/components/route-pending-component.tsx'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_backend')({
  component: RouteComponent,
  beforeLoad({ context: { user } }) {
    if (!user) throw redirect({ to: '/auth', replace: true })

    return { currentUser: user }
  },
  ssr: 'data-only',
  pendingComponent() {
    return (
      <div className="my-16">
        <RoutePendingComponent />
      </div>
    )
  },
})

function RouteComponent() {
  return <Outlet />
}
