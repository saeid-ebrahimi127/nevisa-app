import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { ErrorComponent } from '#/components/error-component.tsx'
import { NotFound } from '#/components/not-found.tsx'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getContext } from './integrations/tanstack-query/root-provider'

export function getRouter() {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: false,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent() {
      return (
        <div className="my-16">
          <NotFound />
        </div>
      )
    },
    defaultErrorComponent({ reset }) {
      return (
        <div className="my-16">
          <ErrorComponent reset={reset} />
        </div>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
