import { Check, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { EditableText } from '../../components/EditableText'
import type { TaskComponentProps, TrueFalseAnswer, TrueFalseTask } from '../../core/types'
import { CorrectBadge, Field, SectionLabel } from '../shared.style'
import { Block, EditRow, Pair } from './TrueFalse.style'

export function TrueFalse({
  task,
  mode,
  status,
  onChange,
  answer,
  onAnswer,
}: TaskComponentProps<TrueFalseTask, TrueFalseAnswer>) {
  const editing = mode === 'edit'
  /** После проверки ответ зафиксирован; правка задачи или «Пройти заново» открывают его снова. */
  const locked = !editing && status !== 'idle'
  const choice = answer?.kind === 'TrueFalse' ? answer.value : null

  const stateFor = (value: boolean): 'idle' | 'correct' | 'incorrect' => {
    if (editing || status === 'idle') return 'idle'
    if (value === task.answer) return 'correct'
    if (choice === value) return 'incorrect'

    return 'idle'
  }

  return (
    <Field>
      <EditableText
        editing={editing}
        value={task.prompt}
        className="prompt"
        placeholder="Введите утверждение…"
        onChange={(prompt) => onChange?.({ ...task, prompt })}
      />
      <SectionLabel>Выберите верное утверждение</SectionLabel>
      <Pair>
        <Block
          type="button"
          $selected={!editing && choice === true}
          $state={stateFor(true)}
          $editing={editing}
          $locked={locked}
          onClick={() => {
            if (editing || locked) return
            onAnswer?.({ kind: 'TrueFalse', value: true })
          }}
        >
          <ThumbsUp size={26} />
          Верно
        </Block>
        <Block
          type="button"
          $selected={!editing && choice === false}
          $state={stateFor(false)}
          $editing={editing}
          $locked={locked}
          onClick={() => {
            if (editing || locked) return
            onAnswer?.({ kind: 'TrueFalse', value: false })
          }}
        >
          <ThumbsDown size={26} />
          Неверно
        </Block>
      </Pair>
      {editing && (
        <EditRow>
          Правильный ответ:
          <CorrectBadge
            $on={task.answer}
            type="button"
            aria-label="Отметить верным"
            onClick={() => onChange?.({ ...task, answer: true })}
          >
            <Check size={12} /> Верно
          </CorrectBadge>
          <CorrectBadge
            $on={!task.answer}
            type="button"
            aria-label="Отметить верным"
            onClick={() => onChange?.({ ...task, answer: false })}
          >
            <X size={12} /> Неверно
          </CorrectBadge>
        </EditRow>
      )}
    </Field>
  )
}
