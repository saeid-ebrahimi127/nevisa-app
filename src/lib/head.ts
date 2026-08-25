import { getAppName } from '#/lib/my-utils.ts'

export const pageTitle = (title: string) => {
  const appName = getAppName()

  return `${appName} - ${title}`
}
