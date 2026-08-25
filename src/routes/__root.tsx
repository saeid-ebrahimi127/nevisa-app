import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import { Header } from '#/components/header.tsx'
import { DirectionProvider } from '#/components/ui/direction.tsx'
import { Toaster } from '#/components/ui/sonner.tsx'
import { TooltipProvider } from '#/components/ui/tooltip.tsx'
import { pageTitle } from '#/lib/head.ts'
import { getAppBootstrapData } from '#/serverfn/app-bootstrap-data.ts'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: pageTitle('ساخته شده با Tanstack Start'),
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  async beforeLoad() {
    const { user, flashMessage } = await getAppBootstrapData()

    return { user, flashMessage }
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { flashMessage } = Route.useRouteContext()

  useEffect(() => {
    if (flashMessage) {
      toast[flashMessage.type](flashMessage.text)
    }
  }, [flashMessage])

  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body className="w-full overflow-x-hidden bg-emerald-50 font-sans antialiased">
        <DirectionProvider dir="rtl">
          <TooltipProvider>
            <Header />
            <main>{children}</main>
          </TooltipProvider>
          <Toaster
            className="pointer-events-auto font-sans!"
            expand
            closeButton
            position="top-center"
            duration={8000}
          />
        </DirectionProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
