import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest/auth')({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('ثبت نام یا ورود') }] }
  },
})

function RouteComponent() {
  return null
}
