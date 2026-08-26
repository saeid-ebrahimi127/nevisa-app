import { AccountAvatar } from '#/components/account/avatar.tsx'
import { AccountGeneralInfo } from '#/components/account/general-info.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_backend/account')({
  component: RouteComponent,
  head({ match }) {
    const { tab } = match.search

    let tabTranslation = ''

    switch (tab) {
      case 'general-info':
        tabTranslation = 'اطلاعات عمومی'
        break
      case 'avatar':
        tabTranslation = 'عکس کاربری'
        break
    }

    return { meta: [{ title: pageTitle(`حساب کاربری - ${tabTranslation}`) }] }
  },
  validateSearch: z.object({
    tab: z
      .literal(['general-info', 'avatar'])
      .optional()
      .default('general-info')
      .catch('general-info'),
  }),
})

function RouteComponent() {
  const { tab } = Route.useSearch()

  return (
    <Tabs value={tab} className="mx-auto max-w-360">
      <TabsList className="h-auto! flex-wrap">
        <TabsTrigger value="general-info">
          <Link to="/account" search={{ tab: 'general-info' }}>
            اطلاعات عمومی
          </Link>
        </TabsTrigger>
        <TabsTrigger value="avatar">
          <Link to="/account" search={{ tab: 'avatar' }}>
            عکس کاربری
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general-info">
        <AccountGeneralInfo />
      </TabsContent>
      <TabsContent value="avatar">
        <AccountAvatar />
      </TabsContent>
    </Tabs>
  )
}
