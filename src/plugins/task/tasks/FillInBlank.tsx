import { useState } from 'react'
import type { FillInBlankTask, TaskComponentProps } from '../core/types'
import { Blank, BlankToken, Paragraph } from './FillInBlank.style'
import { Field, SectionLabel } from './shared.style'

export function FillInBlank({ task, mode, status }: TaskComponentProps<FillInBlankTask>) {
  const editing = mode === 'edit'
  const [values, setValues] = useState<Record<string, string>>({})

  const blankState = (id: string, answer: string): 'idle' | 'correct' | 'incorrect' => {
    if (status === 'idle') return 'idle'

    return (values[id] ?? '').trim().toLowerCase() === answer.trim().toLowerCase()
      ? 'correct'
      : 'incorrect'
  }

  return (
    <Field>
      <SectionLabel>Заполните пропуски</SectionLabel>
      <Paragraph>
        {task.segments.map((seg) => (
          <span key={seg.id}>
            <span
              contentEditable={editing}
              suppressContentEditableWarning
              spellCheck={false}
              style={editing ? { outline: 'none', cursor: 'text' } : undefined}
            >
              {seg.text}
            </span>
            {seg.blank !== null &&
              (editing ? (
                <BlankToken>{seg.blank}</BlankToken>
              ) : (
                <Blank
                  placeholder="…"
                  value={values[seg.id] ?? ''}
                  disabled={status !== 'idle'}
                  $state={blankState(seg.id, seg.blank)}
                  onChange={(e) => setValues((prev) => ({ ...prev, [seg.id]: e.target.value }))}
                />
              ))}
          </span>
        ))}
      </Paragraph>
    </Field>
  )
}
