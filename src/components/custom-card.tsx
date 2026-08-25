import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import type { ReactNode } from 'react'

export const CustomCard = ({
  title,
  description,
  children,
}: {
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
}) => {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
