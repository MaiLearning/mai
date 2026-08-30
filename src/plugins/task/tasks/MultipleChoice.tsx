import { Check, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { EditableText } from '../components/EditableText'
import type { MultipleChoiceTask, TaskComponentProps } from '../core/types'
import {
  AddButton,
  CorrectBadge,
  Field,
  Marker,
  OptionList,
  OptionRow,
  RemoveButton,
  SectionLabel,
} from './shared.style'

export function MultipleChoice({ task, mode, status }: TaskComponentProps<MultipleChoiceTask>) {
  const editing = mode === 'edit'
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    if (editing || status !== 'idle') return

    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  return (
    <Field>
      <EditableText
        editing={editing}
        value={task.prompt}
        className="prompt"
        placeholder="Введите условие задачи…"
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
              onClick={() => toggle(choice.id)}
            >
              <Marker
                $shape="square"
                $checked={!editing && isSelected}
                $state={editing ? 'idle' : state}
              >
                {(state === 'correct' || (!editing && isSelected)) && <Check size={13} />}
              </Marker>
              <EditableText
                editing={editing}
                value={choice.text}
                placeholder="Введите вариант ответа…"
              />
              {editing && (
                <>
                  <CorrectBadge $on={choice.correct} type="button">
                    <Check size={12} /> Верный
                  </CorrectBadge>
                  <RemoveButton type="button" aria-label="Удалить вариант">
                    <Trash2 size={15} />
                  </RemoveButton>
                </>
              )}
            </OptionRow>
          )
        })}
      </OptionList>
      {editing && (
        <AddButton type="button">
          <Plus size={16} /> Добавить вариант
        </AddButton>
      )}
    </Field>
  )
}
