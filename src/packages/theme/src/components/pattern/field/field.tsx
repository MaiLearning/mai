import { Children, type ReactNode, useCallback, useEffect, useId, useMemo, useState } from 'react'
import {
  Counter,
  Description,
  ErrorLine,
  ErrorList,
  FieldRoot,
  LabelRow,
  LabelText,
} from './field.style'
import {
  FieldControlContext,
  type FieldControlContextValue,
  useFieldControlContext,
} from './fieldControl'

export interface FieldProps {
  /** Обязательное поле — звёздочка у подписи и aria-required на контроле. */
  required?: boolean
  /** Блокировка Field — приглушает подпись/сообщения; контрол гасится из контекста. */
  disabled?: boolean
  /** [sugar] Подпись поля — до миграции @mai/fields на compound. */
  label?: ReactNode
  /** [sugar] Явная привязка подписи к контролу. */
  htmlFor?: string
  /** [sugar] Пояснение под контролом. */
  hint?: string
  /** [sugar] Ошибка — перекрывает hint и подсвечивается danger. */
  error?: string
  /** [sugar] Текущее количество символов (для счётчика). */
  count?: number
  /** [sugar] Лимит символов для счётчика. */
  max?: number
  /** Класс контейнера. */
  className?: string
  /** Контрол поля и подкомпоненты Field. */
  children?: ReactNode
}

export interface FieldLabelProps {
  children: ReactNode
  /** Явная привязка label к id контрола (когда контрол не подписан на Field). */
  htmlFor?: string
  /** Переопределяет обязательность корня Field. */
  required?: boolean
  className?: string
}

export interface FieldDescriptionProps {
  children: ReactNode
  className?: string
}

export interface FieldErrorProps {
  children?: ReactNode
  className?: string
}

export interface FieldErrorMessageProps {
  children: ReactNode
  className?: string
}

export interface FieldCounterProps {
  count: number
  max: number
  className?: string
}

/**
 * Field — семантический и функциональный контейнер одного элемента данных
 * формы. Не отвечает за то, как пользователь вводит данные (это забота
 * контрола), а за то, как элемент данных представлен в форме: подпись,
 * описание, ошибки, счётчик и связь label ↔ control ↔ сообщения.
 *
 * Compound-API:
 *
 * @example
 * <Field required disabled>
 *   <Field.Label>Username</Field.Label>
 *   <Input />
 *   <Field.Description>Your public username.</Field.Description>
 *   <Field.Error>
 *     <Field.ErrorMessage>Username is required</Field.ErrorMessage>
 *   </Field.Error>
 *   <Field.Counter count={5} max={10} />
 * </Field>
 *
 * До перевода `@mai/fields` на compound `Field` также принимает плоские
 * пропсы (`label`, `hint`, `error`, `count`/`max`), образующие сахар,
 * который собирается в те же подкомпоненты.
 *
 * Контрол участвует в Field через контракт `useFieldControl` (см.
 * `fieldControl.tsx`): получает id, disabled/invalid и aria-атрибуты.
 */
function FieldInner({
  required = false,
  disabled = false,
  label,
  htmlFor,
  hint,
  error,
  count,
  max,
  className,
  children,
}: FieldProps) {
  const factoryId = useId()
  const [controlId, setControlId] = useState<string | undefined>(undefined)
  const [messageIds, setMessageIds] = useState<string[]>([])
  const [invalid, setInvalid] = useState(false)

  const registerControlId = useCallback((id: string | undefined) => {
    setControlId((prev) => (prev === id ? prev : id))
  }, [])

  const registerMessage = useCallback((id: string) => {
    setMessageIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const unregisterMessage = useCallback((id: string) => {
    setMessageIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev))
  }, [])

  const contextValue = useMemo<FieldControlContextValue>(
    () => ({
      factoryId,
      controlId,
      registerControlId,
      required,
      disabled,
      invalid,
      setInvalid,
      registerMessage,
      unregisterMessage,
      messageIds,
    }),
    [
      factoryId,
      controlId,
      registerControlId,
      required,
      disabled,
      invalid,
      registerMessage,
      unregisterMessage,
      messageIds,
    ],
  )

  const sugarLabel = label != null
  const sugarCounter = typeof count === 'number' && typeof max === 'number' ? { count, max } : null
  const sugarError = error != null

  return (
    <FieldControlContext.Provider value={contextValue}>
      <FieldRoot className={className}>
        {sugarLabel || sugarCounter ? (
          <LabelRow>
            {sugarLabel ? <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel> : null}
            {sugarCounter ? <FieldCounter {...sugarCounter} /> : null}
          </LabelRow>
        ) : null}
        {children}
        {sugarError ? (
          <FieldError>
            <FieldErrorMessage>{error}</FieldErrorMessage>
          </FieldError>
        ) : hint != null ? (
          <FieldDescription>{hint}</FieldDescription>
        ) : null}
      </FieldRoot>
    </FieldControlContext.Provider>
  )
}

function FieldLabel({ children, htmlFor, required, className }: FieldLabelProps) {
  const ctx = useFieldControlContext()
  const effectiveRequired = required ?? ctx?.required ?? false
  const effectiveHtmlFor = htmlFor ?? ctx?.controlId

  return (
    <LabelText $disabled={ctx?.disabled} htmlFor={effectiveHtmlFor} className={className}>
      {children}
      {effectiveRequired ? <span aria-hidden="true">*</span> : null}
    </LabelText>
  )
}

function FieldDescription({ children, className }: FieldDescriptionProps) {
  const id = useId()
  const ctx = useFieldControlContext()
  const registerMessage = ctx?.registerMessage
  const unregisterMessage = ctx?.unregisterMessage

  useEffect(() => {
    if (!registerMessage || !unregisterMessage) return
    registerMessage(id)

    return () => unregisterMessage(id)
  }, [registerMessage, unregisterMessage, id])

  return (
    <Description id={id} $disabled={ctx?.disabled} className={className}>
      {children}
    </Description>
  )
}

function FieldError({ children, className }: FieldErrorProps) {
  const id = useId()
  const ctx = useFieldControlContext()
  const hasMessages = Children.count(children) > 0
  const registerMessage = ctx?.registerMessage
  const unregisterMessage = ctx?.unregisterMessage
  const setInvalid = ctx?.setInvalid

  useEffect(() => {
    if (!hasMessages) return
    registerMessage?.(id)
    setInvalid?.(true)

    return () => {
      unregisterMessage?.(id)
      setInvalid?.(false)
    }
  }, [hasMessages, id, registerMessage, unregisterMessage, setInvalid])

  if (!hasMessages) return null

  return (
    <ErrorList id={id} role="alert" className={className}>
      {children}
    </ErrorList>
  )
}

function FieldErrorMessage({ children, className }: FieldErrorMessageProps) {
  return <ErrorLine className={className}>{children}</ErrorLine>
}

function FieldCounter({ count, max, className }: FieldCounterProps) {
  const ctx = useFieldControlContext()

  return (
    <Counter $over={count > max} $disabled={ctx?.disabled} className={className}>
      {count}/{max}
    </Counter>
  )
}

export const Field = Object.assign(FieldInner, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  ErrorMessage: FieldErrorMessage,
  Counter: FieldCounter,
})
