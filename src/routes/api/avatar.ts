import { auth } from '#/lib/auth.server.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { errorMessage } from '#/lib/message.ts'
import { deleteImage, storeImage } from '#/lib/utils.server.ts'
import { createRateLimiterMiddlewareForAuthenticatedUsers } from '#/middleware/rate-limiter.ts'
import { avatarZodSchema } from '#/zod-schema/image.ts'
import { createFileRoute } from '@tanstack/react-router'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'

export const Route = createFileRoute('/api/avatar')({
  server: {
    handlers({ createHandlers }) {
      return createHandlers({
        POST: {
          middleware: [
            createRateLimiterMiddlewareForAuthenticatedUsers({
              requireAuthMiddleware_throwError: false,
              key: 'avatar',
            }),
          ],
          async handler({
            request,
            context: { currentUser, rateLimiterErrorMessage },
          }) {
            if (rateLimiterErrorMessage) {
              return Response.json(
                { errorMessage: rateLimiterErrorMessage },
                { status: 429 },
              )
            }

            try {
              const formData = await request.formData()

              const {
                success,
                error,
                data: avatar,
              } = avatarZodSchema.schema.safeParse(formData.get('avatar'))

              if (!success) {
                return Response.json(
                  { errorMessage: z.treeifyError(error).errors[0] },
                  { status: 400 },
                )
              }

              const { fileName } = await storeImage(
                await avatar.arrayBuffer(),
                300,
              )

              const prevAvatar = currentUser.image

              await auth.api.updateUser({
                body: {
                  image: new URL(
                    `/api/image/${fileName}`,
                    serverEnv.APP_URL,
                  ).toString(),
                },
                headers: getRequestHeaders(),
              })

              if (prevAvatar) {
                await deleteImage(prevAvatar)
              }

              return Response.json({}, { status: 201 })
            } catch {
              return Response.json(
                { errorMessage: errorMessage.generic },
                { status: 500 },
              )
            }
          },
        },
        DELETE: {
          middleware: [
            createRateLimiterMiddlewareForAuthenticatedUsers({
              requireAuthMiddleware_throwError: false,
              key: 'avatar',
            }),
          ],
          async handler({ context: { currentUser, rateLimiterErrorMessage } }) {
            if (rateLimiterErrorMessage) {
              return Response.json(
                { errorMessage: rateLimiterErrorMessage },
                { status: 429 },
              )
            }

            try {
              if (currentUser.image) {
                const prevAvatar = currentUser.image

                await auth.api.updateUser({
                  body: { image: null },
                  headers: getRequestHeaders(),
                })

                await deleteImage(prevAvatar)
              }

              return new Response(undefined, { status: 204 })
            } catch {
              return Response.json(
                { errorMessage: errorMessage.generic },
                { status: 500 },
              )
            }
          },
        },
      })
    },
  },
})
