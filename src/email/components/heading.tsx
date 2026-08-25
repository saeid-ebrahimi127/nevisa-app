import { Heading } from 'react-email'

export const EmailHeading = ({ text }: { text: string }) => {
  return <Heading className="text-xl font-medium">{text}</Heading>
}
