import { Plus, Trash2 } from 'lucide-react'
import { EditableText } from '../components/EditableText'
import type { OrderingTask, TaskComponentProps } from '../core/types'
import { Grip, Index, Item, List } from './Ordering.style'
import { AddButton, Field, RemoveButton, SectionLabel } from './shared.style'

export function Ordering({ task, mode, status }: TaskComponentProps<OrderingTask>) {
  const editing = mode === 'edit'
  const state = editing
    ? 'idle'
    : status === 'correct'
      ? 'correct'
      : status === 'incorrect'
        ? 'incorrect'
        : 'idle'

  return (
    <Field>
      <EditableText editing={editing} value={task.prompt} className="prompt" />
      <SectionLabel>Расставьте элементы в правильном порядке</SectionLabel>
      <List>
        {task.items.map((item, i) => (
          <Item key={item.id} $state={state} $editing={editing}>
            <Index>{i + 1}</Index>
            <EditableText editing={editing} value={item.text} />
            {editing ? (
              <RemoveButton
                type="button"
                aria-label="Удалить элемент"
                style={{ marginLeft: 'auto' }}
              >
                <Trash2 size={15} />
              </RemoveButton>
            ) : (
              <Grip size={17} />
            )}
          </Item>
        ))}
      </List>
      {editing && (
        <AddButton type="button">
          <Plus size={16} /> Добавить элемент
        </AddButton>
      )}
    </Field>
  )
}
