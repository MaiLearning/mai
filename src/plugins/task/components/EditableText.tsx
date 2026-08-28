import { Editable } from './EditableText.style'

interface EditableTextProps {
  value: string
  editing: boolean
  muted?: boolean
  placeholder?: string
  className?: string
}

/**
 * WYSIWYG-текст: обычный текст в режиме solve и редактируемое поле в режиме edit.
 * Техническая часть (сохранение) вне зоны ответственности — важен визуал.
 */
export function EditableText({ value, editing, muted, placeholder, className }: EditableTextProps) {
  return (
    <Editable
      className={className}
      $editing={editing}
      $muted={muted}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
    >
      {value}
    </Editable>
  )
}
