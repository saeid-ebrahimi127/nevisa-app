import { getLocalImage } from '#/lib/utils.server.ts'
import { imageFileNameZodSchema } from '#/zod-schema/image.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/image/$fileName')({
  server: {
    handlers: {
      async GET({ params }) {
        try {
          const { success, data: fileName } = imageFileNameZodSchema.safeParse(
            params.fileName,
          )

          if (!success) {
            return Response.json(
              { errorMessage: 'not found.' },
              { status: 404 },
            )
          }

          const image = await getLocalImage(fileName)

          return new Response(image, {
            headers: {
              'Content-Type': 'image/webp',
              'Content-Disposition': `inline; filename="${fileName}"`,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        } catch {
          return Response.json({ errorMessage: 'not found.' }, { status: 404 })
        }
      },
    },
  },
})
