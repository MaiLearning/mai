import { EditableText } from '../../components/EditableText'
import type { FillInBlankAnswer, FillInBlankTask, TaskComponentProps } from '../../core/types'
import { Field, SectionLabel } from '../shared.style'
import { Blank, Paragraph } from './FillInBlank.style'
import { FillInBlankEditor } from './FillInBlankEditor'

export function FillInBlank({
  task,
  mode,
  status,
  onChange,
  answer,
  onAnswer,
}: TaskComponentProps<FillInBlankTask, FillInBlankAnswer>) {
  if (mode === 'edit')
    return <FillInBlankEditor task={task} onChange={(next) => onChange?.(next)} />

  /** После проверки ответ зафиксирован; «Пройти заново» открывает пропуска снова. */
  const locked = status !== 'idle'

  /** id сегмента с пропуском → введённый текст. */
  const values = answer?.kind === 'FillInBlank' ? answer.values : {}

  const blankState = (id: string, correct: string): 'idle' | 'correct' | 'incorrect' => {
    if (status === 'idle') return 'idle'

    return (values[id] ?? '').trim().toLowerCase() === correct.trim().toLowerCase()
      ? 'correct'
      : 'incorrect'
  }

  return (
    <Field>
      <EditableText editing={false} grow value={task.prompt} className="prompt" />
      <SectionLabel>Заполните пропуски</SectionLabel>
      <Paragraph>
        {task.segments.map((seg) => (
          <span key={seg.id}>
            {seg.text}
            {seg.blank !== null && (
              <Blank
                placeholder="…"
                value={values[seg.id] ?? ''}
                $state={blankState(seg.id, seg.blank)}
                $locked={locked}
                readOnly={locked}
                onChange={(e) => {
                  if (locked) return
                  onAnswer?.({
                    kind: 'FillInBlank',
                    values: { ...values, [seg.id]: e.target.value },
                  })
                }}
              />
            )}
          </span>
        ))}
      </Paragraph>
    </Field>
  )
}
