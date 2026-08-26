import { AccountAvatar } from '#/components/account/avatar.tsx'
import { AccountDeleteMyAccount } from '#/components/account/delete-my-account.tsx'
import { AccountEmail } from '#/components/account/email.tsx'
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
      case 'email':
        tabTranslation = 'ایمیل کاربری'
        break
      case 'delete-my-account':
        tabTranslation = 'حذف حساب کاربری من'
        break
    }

    return { meta: [{ title: pageTitle(`حساب کاربری - ${tabTranslation}`) }] }
  },
  validateSearch: z.object({
    tab: z
      .literal(['general-info', 'avatar', 'email', 'delete-my-account'])
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
        <TabsTrigger value="email">
          <Link to="/account" search={{ tab: 'email' }}>
            ایمیل کاربری
          </Link>
        </TabsTrigger>
        <TabsTrigger value="delete-my-account" className="text-destructive!">
          <Link to="/account" search={{ tab: 'delete-my-account' }}>
            حذف حساب کاربری من
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general-info">
        <AccountGeneralInfo />
      </TabsContent>
      <TabsContent value="avatar">
        <AccountAvatar />
      </TabsContent>
      <TabsContent value="email">
        <AccountEmail />
      </TabsContent>
      <TabsContent value="delete-my-account">
        <AccountDeleteMyAccount />
      </TabsContent>
    </Tabs>
  )
}
