import { Check, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { useState } from 'react'
import { EditableText } from '../components/EditableText'
import type { TaskComponentProps, TrueFalseTask } from '../core/types'
import { CorrectBadge, Field, SectionLabel } from './shared.style'
import { Block, EditRow, Pair } from './TrueFalse.style'

export function TrueFalse({ task, mode, status }: TaskComponentProps<TrueFalseTask>) {
  const editing = mode === 'edit'
  const [choice, setChoice] = useState<boolean | null>(null)

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
      />
      <SectionLabel>Выберите верное утверждение</SectionLabel>
      <Pair>
        <Block
          type="button"
          $selected={!editing && choice === true}
          $state={stateFor(true)}
          onClick={() => !editing && status === 'idle' && setChoice(true)}
        >
          <ThumbsUp size={26} />
          Верно
        </Block>
        <Block
          type="button"
          $selected={!editing && choice === false}
          $state={stateFor(false)}
          onClick={() => !editing && status === 'idle' && setChoice(false)}
        >
          <ThumbsDown size={26} />
          Неверно
        </Block>
      </Pair>
      {editing && (
        <EditRow>
          Правильный ответ:
          <CorrectBadge $on={task.answer} type="button">
            <Check size={12} /> Верно
          </CorrectBadge>
          <CorrectBadge $on={!task.answer} type="button">
            <X size={12} /> Неверно
          </CorrectBadge>
        </EditRow>
      )}
    </Field>
  )
}
