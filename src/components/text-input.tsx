import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { useController } from 'react-hook-form'

export const TextInput = <T extends FieldValues>({
  control,
  name,
  label,
  inputProps,
  autoFocus = false,
}: {
  control: Control<T>
  name: Path<T>
  label?: ReactNode
  inputProps?: ComponentProps<typeof Input>
  autoFocus?: boolean
}) => {
  const { field, fieldState } = useController({ control, name })

  const id = `${name}-${useId()}`

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Input
        {...field}
        {...inputProps}
        id={id}
        aria-invalid={fieldState.invalid}
        ref={(input) => {
          field.ref(input)

          if (autoFocus && input) {
            requestAnimationFrame(() => {
              input.focus()

              try {
                const length = input.value.length
                input.setSelectionRange(length, length)
              } catch {}
            })
          }
        }}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
