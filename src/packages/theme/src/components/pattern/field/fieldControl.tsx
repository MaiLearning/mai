import { createContext, useContext, useLayoutEffect } from 'react'

/**
 * Базовые пропсы контрола, участвующего в Field по контракту. Принимающие
 * участие контролы (примитивы `Input`/`Textarea`/`Checkbox` и кастомные
 * `PasswordInput`/`PinInput`) расширяют этот тип и читают контекст Field
 * через `useFieldControl`.
 */
export interface FieldControlProps {
  id?: string
  disabled?: boolean
  invalid?: boolean
}

/** Пропсы, которые контракт отдаёт контролу для spread на нативный элемент. */
export interface FieldControlProvidedProps {
  id?: string
  disabled?: boolean
  'aria-invalid'?: boolean
  'aria-required'?: boolean
  'aria-describedby'?: string
}

/**
 * Контекст Field — источник связи подписи, сообщений и контрола. Создаётся
 * корнем `Field`, читается подкомпонентами (`Field.Label`, `Field.Error`…)
 * и контролами через `useFieldControl`.
 */
export interface FieldControlContextValue {
  /** Запасной id контрола, генерируемый корнем Field. */
  factoryId: string
  /** Фактический id контрола (зарегистрированный им самим или заданный). */
  controlId?: string
  registerControlId: (id: string | undefined) => void
  /** Обязательное поле — звёздочка у подписи и aria-required. */
  required: boolean
  /** Блокировка Field — приглушает подписи/сообщения и контрол. */
  disabled: boolean
  /** Наличие ошибок — снимается подкомпонентом Field.Error. */
  invalid: boolean
  setInvalid: (value: boolean) => void
  registerMessage: (id: string) => void
  unregisterMessage: (id: string) => void
  /** id описаний и ошибок для aria-describedby контрола. */
  messageIds: string[]
}

export const FieldControlContext = createContext<FieldControlContextValue | null>(null)

/** Контекст Field для подкомпонентов корня (`Label`, `Error`, `Description`, `Counter`). */
export function useFieldControlContext(): FieldControlContextValue | null {
  return useContext(FieldControlContext)
}

/**
 * Контракт Control ↔ Field. Хук используется примитивами-контролами,
 * вложенными в `<Field>`: возвращает готовые пропсы (`id`, `disabled`,
 * `aria-*`) для spread на нативный элемент ввода.
 *
 * Свои пропсы контрола (`own.id`, `own.disabled`, `own.invalid`) имеют
 * приоритет над контекстом Field; вне Field хук просто отдаёт собственные
 * значения, без автоматики.
 *
 * @example
 * const props = useFieldControl({ id, disabled, invalid })
 * return <input {...props} {...rest} />
 */
export function useFieldControl(own: FieldControlProps = {}): FieldControlProvidedProps {
  const ctx = useFieldControlContext()

  if (!ctx) {
    return {
      id: own.id,
      disabled: own.disabled,
      'aria-invalid': own.invalid ? true : undefined,
    }
  }

  const id = own.id ?? ctx.factoryId
  const { registerControlId } = ctx

  useLayoutEffect(() => {
    registerControlId(id)
  }, [registerControlId, id])

  const describedBy = ctx.messageIds.length > 0 ? ctx.messageIds.join(' ') : undefined

  return {
    id,
    disabled: own.disabled ?? ctx.disabled,
    'aria-invalid': own.invalid || ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-describedby': describedBy,
  }
}
