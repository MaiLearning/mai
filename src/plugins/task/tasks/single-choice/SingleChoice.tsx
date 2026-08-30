import { Check, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { EditableText } from '../../components/EditableText'
import type { Choice, SingleChoiceTask, TaskComponentProps } from '../../core/types'
import { Field, SectionLabel } from '../shared.style'
import {
  AddButton,
  CorrectBadge,
  Marker,
  OptionList,
  OptionRow,
  RemoveButton,
} from './SingleChoice.style'

export function SingleChoice({
  task,
  mode,
  status,
  onChange,
}: TaskComponentProps<SingleChoiceTask>) {
  const editing = mode === 'edit'
  const [selected, setSelected] = useState<string | null>(null)

  const updateChoices = (choices: Choice[]) => onChange?.({ ...task, choices })

  const updateChoice = (choiceId: string, update: Partial<Choice>) =>
    updateChoices(task.choices.map((c) => (c.id === choiceId ? { ...c, ...update } : c)))

  const addChoice = () =>
    updateChoices([...task.choices, { id: crypto.randomUUID(), text: '', correct: false }])

  const removeChoice = (choiceId: string) =>
    updateChoices(task.choices.filter((c) => c.id !== choiceId))

  /** Единственный верный вариант: выбор сбрасывает отметку у остальных. */
  const toggleCorrect = (choiceId: string) =>
    updateChoices(task.choices.map((c) => ({ ...c, correct: c.id === choiceId })))

  return (
    <Field>
      <EditableText
        editing={editing}
        grow
        value={task.prompt}
        className="prompt"
        placeholder="Введите условие задачи…"
        onChange={(prompt) => onChange?.({ ...task, prompt })}
      />
      <SectionLabel>Выберите один вариант</SectionLabel>
      <OptionList>
        {task.choices.map((choice) => {
          const isSelected = selected === choice.id
          const state =
            status !== 'idle' && (choice.correct || isSelected)
              ? choice.correct
                ? 'correct'
                : 'incorrect'
              : 'idle'

          return (
            <OptionRow
              key={choice.id}
              $selected={!editing && isSelected}
              $state={editing ? 'idle' : state}
              $editing={editing}
              onClick={() => !editing && status === 'idle' && setSelected(choice.id)}
            >
              {!editing && (
                <Marker $shape="circle" $checked={isSelected} $state={state}>
                  {(state === 'correct' || isSelected) && <Check size={13} />}
                </Marker>
              )}
              <EditableText
                editing={editing}
                value={choice.text}
                className="option-text"
                placeholder="Введите вариант ответа…"
                offset={false}
                onChange={(text) => updateChoice(choice.id, { text })}
              />
              {editing && (
                <>
                  <CorrectBadge
                    $on={choice.correct}
                    type="button"
                    aria-label="Отметить верным"
                    onClick={() => toggleCorrect(choice.id)}
                  >
                    <Check size={12} /> Верный
                  </CorrectBadge>
                  <RemoveButton
                    type="button"
                    aria-label="Удалить вариант"
                    onClick={() => removeChoice(choice.id)}
                  >
                    <Trash2 size={15} />
                  </RemoveButton>
                </>
              )}
            </OptionRow>
          )
        })}
      </OptionList>
      {editing && (
        <AddButton type="button" onClick={addChoice}>
          <Plus size={16} /> Добавить вариант
        </AddButton>
      )}
    </Field>
  )
}
