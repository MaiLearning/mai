import { arrayMove } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { EditableText } from '../../components/EditableText'
import type {
  OrderingAnswer,
  OrderingItem,
  OrderingTask,
  TaskComponentProps,
} from '../../core/types'
import { seededShuffle } from '../../lib/seeded-shuffle'
import { AddButton, Field, SectionLabel } from '../shared.style'
import type { RowState } from './Ordering.style'
import { Grip, List } from './Ordering.style'
import type { DragHandleProps } from './OrderingDnd'
import { OrderingDnd, SortableRow } from './OrderingDnd'
import { SortableItemRow } from './SortableItemRow'

export function Ordering({
  task,
  mode,
  status,
  onChange,
  answer,
  onAnswer,
}: TaskComponentProps<OrderingTask, OrderingAnswer>) {
  const editing = mode === 'edit'
  /** После проверки порядок зафиксирован; правка задачи или «Пройти заново» открывают его снова. */
  const locked = !editing && status !== 'idle'

  // Порядок отображения: edit — сам массив задачи (он и есть правильный),
  // solve — ответ ученика, а если его нет (в т.ч. пустой после сброса) —
  // перемешивание, стабильное между сессиями.
  const displayedIds = useMemo(() => {
    if (editing) return task.items.map((item) => item.id)
    if (answer?.kind === 'Ordering' && answer.itemIds.length > 0) return answer.itemIds

    return seededShuffle(task.items, task.id).map((item) => item.id)
  }, [editing, task.items, task.id, answer])

  const itemsById = useMemo(() => new Map(task.items.map((item) => [item.id, item])), [task.items])

  // После проверки — состояние строки по позиции: как в правильном порядке.
  const rowState = (index: number): RowState => {
    if (editing || status === 'idle') return 'idle'

    return displayedIds[index] === task.items[index]?.id ? 'correct' : 'incorrect'
  }

  const updateItems = (items: OrderingItem[]) => onChange?.({ ...task, items })
  const addItem = () => updateItems([...task.items, { id: crypto.randomUUID(), text: '' }])
  const removeItem = (id: string) => updateItems(task.items.filter((item) => item.id !== id))
  const updateItem = (id: string, text: string) =>
    updateItems(task.items.map((item) => (item.id === id ? { ...item, text } : item)))

  // edit — правим порядок массива задачи; solve — записываем ответ (только по дропу),
  // после проверки порядок зафиксирован и не переписывается.
  const reorder = (from: number, to: number) => {
    if (editing) {
      onChange?.({ ...task, items: arrayMove(task.items, from, to) })

      return
    }
    if (locked) return
    onAnswer?.({ kind: 'Ordering', itemIds: arrayMove(displayedIds, from, to) })
  }

  const renderRow = (id: string, index: number, overlay: boolean, handle?: DragHandleProps) => {
    const item = itemsById.get(id)
    if (!item) return null

    return (
      <SortableItemRow
        index={index}
        text={item.text}
        state={rowState(index)}
        editing={editing}
        locked={locked}
        onTextChange={editing ? (text) => updateItem(id, text) : undefined}
        onRemove={editing ? () => removeItem(id) : undefined}
        handle={
          editing && !overlay && handle ? (
            <Grip size={17} {...handle} />
          ) : (
            <Grip size={17} $locked={locked} />
          )
        }
      />
    )
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
      <SectionLabel>Расставьте элементы в правильном порядке</SectionLabel>
      <OrderingDnd
        ids={displayedIds}
        onReorder={reorder}
        overlayFor={(id) => renderRow(id, displayedIds.indexOf(id), true)}
      >
        <List>
          {displayedIds.map((id, index) => (
            <SortableRow key={id} id={id} wholeRowDrag={!editing} disabled={locked}>
              {(handle) => renderRow(id, index, false, handle)}
            </SortableRow>
          ))}
        </List>
      </OrderingDnd>
      {editing && (
        <AddButton type="button" onClick={addItem}>
          <Plus size={16} /> Добавить элемент
        </AddButton>
      )}
    </Field>
  )
}
