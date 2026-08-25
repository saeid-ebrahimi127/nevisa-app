import { Text } from 'react-email'

export const EmailExpiryNotice = ({ minutes }: { minutes: number }) => {
  return (
    <Text>
      دقت نمایید که لینک مورد نظر فقط تا {minutes} دقیقه ی دیگر قابل استفاده
      خواهد بود.
    </Text>
  )
}
