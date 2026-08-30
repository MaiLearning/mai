import { X } from 'lucide-react'
import { useState } from 'react'
import { BlankToken, ChipRemove, InlineInput } from './FillInBlank.style'

interface BlankChipProps {
  /** Эталонный ответ пропуска. */
  answer: string
  /** Коммит правки ответа (blur/Enter). */
  onAnswerChange: (answer: string) => void
  /** Убрать пропуск (крестик). */
  onRemove: () => void
}

/**
 * Чип пропуска в редакторе: несъедобный (contentEditable=false), показывает
 * эталонный ответ; двойной клик открывает инлайн-инпут правки. Крестик
 * гасит фокус-похищение через preventDefault на mousedown — коммит текста
 * параграфа не срывается.
 */
export function BlankChip({ answer, onAnswerChange, onRemove }: BlankChipProps) {
  const [editing, setEditing] = useState(false)

  const commit = (value: string) => {
    setEditing(false)
    onAnswerChange(value)
  }

  return (
    <BlankToken
      contentEditable={false}
      data-blank
      data-answer={answer}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <InlineInput
          autoFocus
          defaultValue={answer}
          onBlur={(e) => commit(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit(e.currentTarget.value)
            if (e.key === 'Escape') setEditing(false)
          }}
        />
      ) : (
        <>
          {answer}
          <ChipRemove
            type="button"
            aria-label="Убрать пропуск"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onRemove}
          >
            <X size={12} />
          </ChipRemove>
        </>
      )}
    </BlankToken>
  )
}
