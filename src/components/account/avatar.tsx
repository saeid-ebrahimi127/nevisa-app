import { CustomAvatar } from '#/components/custom-avatar.tsx'
import { CustomCard } from '#/components/custom-card.tsx'
import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { Button } from '#/components/ui/button.tsx'
import { useAxiosErrorHandler } from '#/hooks/use-axios-error-handler.ts'
import { errorMessage, successMessage } from '#/lib/message.ts'
import { avatarZodSchema } from '#/zod-schema/image.ts'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import axios, { AxiosError } from 'axios'
import {
  ImageIcon,
  TrashIcon,
  UploadCloudIcon,
  XCircleIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const AccountAvatar = () => {
  const { currentUser } = useRouteContext({ from: '/_backend' })

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const inputFileRef = useRef<HTMLInputElement>(null)

  const clearInputFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!selectedAvatar) return

    const preview = URL.createObjectURL(selectedAvatar)

    setAvatarPreview(preview)

    return () => {
      URL.revokeObjectURL(preview)

      setAvatarPreview(null)
    }
  }, [selectedAvatar])

  const [isAvatarMutating, setIsAvatarMutating] = useState(false)

  const router = useRouter()

  const { handler: axiosErrorHandler } = useAxiosErrorHandler()

  const uploadOrDeleteAvatar = async (type: 'upload' | 'delete') => {
    try {
      if (type === 'upload') {
        if (!selectedAvatar) return

        setIsAvatarMutating(true)

        const formData = new FormData()
        formData.set('avatar', selectedAvatar)

        await axios.post('/api/avatar', formData)

        setSelectedAvatar(null)

        toast.success(successMessage.yourAvatarSaved)
      }

      if (type === 'delete') {
        setIsAvatarMutating(true)

        await axios.delete('/api/avatar')

        toast.success(successMessage.yourAvatarDeleted)
      }

      router.invalidate({
        filter(r) {
          return r.routeId === '__root__'
        },
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        await axiosErrorHandler(error)

        return
      }

      toast.error(errorMessage.generic)
    } finally {
      setIsAvatarMutating(false)
    }
  }

  return (
    <CustomCard
      title={<h1>عکس کاربری</h1>}
      description="عکس کاربری خود را اینجا تغییر دهید."
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <CustomAvatar
          src={avatarPreview || currentUser.image || undefined}
          alt={
            avatarPreview ? 'عکس انتخاب شده' : `عکس کاربری ${currentUser.name}`
          }
          fallback={currentUser.name[0]!}
          className="size-20"
          fallbackClassName="text-2xl"
        />
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 text-center">
          <p>حداکثر حجم عکس: {avatarZodSchema.maxSizeInMB} مگابایت</p>
          <p>فرمت های مجاز: {avatarZodSchema.prettyValidTypes}</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            inputFileRef.current?.click()
          }}
          disabled={isAvatarMutating}
          variant={'outline'}
        >
          <ImageIcon />
          انتخاب عکس
        </Button>
        {avatarPreview && (
          <Button
            type="button"
            disabled={isAvatarMutating}
            onClick={() => {
              setSelectedAvatar(null)
            }}
            variant={'destructive'}
          >
            <XCircleIcon />
            حذف عکس انتخاب شده
          </Button>
        )}
        {selectedAvatar && (
          <LoadingSwapBtn
            type="button"
            disabled={isAvatarMutating}
            onClick={async () => {
              await uploadOrDeleteAvatar('upload')
            }}
          >
            <span className="flex items-center gap-1.5">
              <UploadCloudIcon />
              بارگذاری عکس
            </span>
          </LoadingSwapBtn>
        )}
        {currentUser.image && (
          <LoadingSwapBtn
            type="button"
            disabled={isAvatarMutating}
            onClick={async () => {
              await uploadOrDeleteAvatar('delete')
            }}
            variant={'destructive'}
          >
            <span className="flex items-center gap-1.5">
              <TrashIcon />
              حذف عکس کاربری
            </span>
          </LoadingSwapBtn>
        )}
      </div>
      <input
        type="file"
        className="sr-only"
        ref={inputFileRef}
        accept={avatarZodSchema.inputFileAccept}
        onChange={(e) => {
          const file = e.target.files?.[0]

          if (!file) return

          const {
            success,
            error,
            data: avatar,
          } = avatarZodSchema.schema.safeParse(file)

          if (!success) {
            toast.error(z.treeifyError(error).errors[0])

            return
          }

          setSelectedAvatar(avatar)

          clearInputFile()
        }}
      />
    </CustomCard>
  )
}
