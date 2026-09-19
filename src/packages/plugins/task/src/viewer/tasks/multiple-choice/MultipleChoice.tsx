import { Check, Plus, Trash2 } from 'lucide-react'
import { EditableText } from '../../components/EditableText'
import type {
  Choice,
  MultipleChoiceAnswer,
  MultipleChoiceTask,
  TaskComponentProps,
} from '../../core/types'
import { Field, SectionLabel } from '../shared.style'
import {
  AddButton,
  CorrectBadge,
  Marker,
  OptionList,
  OptionRow,
  RemoveButton,
} from './MultipleChoice.style'

export function MultipleChoice({
  task,
  mode,
  status,
  onChange,
  answer,
  onAnswer,
}: TaskComponentProps<MultipleChoiceTask, MultipleChoiceAnswer>) {
  const editing = mode === 'edit'
  /** После проверки ответ зафиксирован; правка задачи или «Пройти заново» открывают его снова. */
  const locked = !editing && status !== 'idle'
  const selected = new Set(answer?.kind === 'MultipleChoice' ? answer.choiceIds : [])

  const updateChoices = (choices: Choice[]) => onChange?.({ ...task, choices })

  const updateChoice = (choiceId: string, update: Partial<Choice>) =>
    updateChoices(task.choices.map((c) => (c.id === choiceId ? { ...c, ...update } : c)))

  const addChoice = () =>
    updateChoices([...task.choices, { id: crypto.randomUUID(), text: '', correct: false }])

  const removeChoice = (choiceId: string) =>
    updateChoices(task.choices.filter((c) => c.id !== choiceId))

  /** Несколько верных вариантов: отметка не сбрасывает отметки у остальных. */
  const toggleCorrect = (choiceId: string) =>
    updateChoices(
      task.choices.map((c) => ({ ...c, correct: c.id === choiceId ? !c.correct : c.correct })),
    )

  /** Тоггл варианта в наборе выбранных. */
  const toggleSelect = (choiceId: string) => {
    const next = new Set(selected)
    if (next.has(choiceId)) {
      next.delete(choiceId)
    } else {
      next.add(choiceId)
    }

    onAnswer?.({ kind: 'MultipleChoice', choiceIds: [...next] })
  }

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
      <SectionLabel>Выберите все подходящие варианты</SectionLabel>
      <OptionList>
        {task.choices.map((choice) => {
          const isSelected = selected.has(choice.id)
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
              $locked={locked}
              onClick={() => {
                if (editing || locked) return
                toggleSelect(choice.id)
              }}
            >
              {!editing && (
                <Marker $shape="square" $checked={isSelected} $state={state}>
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
