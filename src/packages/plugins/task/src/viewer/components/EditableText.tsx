import { useEffect, useRef } from 'react'
import { Editable } from './EditableText.style'

interface EditableTextProps {
  value: string
  editing: boolean
  muted?: boolean
  placeholder?: string
  className?: string
  /** Правка текста: коммит по blur (DOM — источник во время ввода, курсор не скачет). */
  onChange?: (value: string) => void
  /** На всю ширину с переносом строк (условие задачи). */
  grow?: boolean
  /** Компенсация padding негативными полями; в строках вариантов отключается. */
  offset?: boolean
}

/**
 * WYSIWYG-текст: обычный текст в режиме solve и редактируемое поле в режиме edit.
 * Во время ввода React не управляет содержимым (uncontrolled) — правка уходит
 * наверх по blur, синхронизация пропа → DOM только вне фокуса.
 */
export function EditableText({
  value,
  editing,
  muted,
  placeholder,
  className,
  onChange,
  grow,
  offset = true,
}: EditableTextProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const focusedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (el && !focusedRef.current && el.textContent !== value) el.textContent = value
  }, [value, editing])

  return (
    <Editable
      ref={ref}
      className={className}
      $editing={editing}
      $muted={muted}
      $grow={grow ?? false}
      $offset={offset}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onFocus={() => {
        focusedRef.current = true
      }}
      onBlur={(e) => {
        focusedRef.current = false
        onChange?.(e.currentTarget.textContent ?? '')
      }}
    >
      {editing ? undefined : value}
    </Editable>
  )
}
