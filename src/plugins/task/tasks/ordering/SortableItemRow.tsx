import { Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { EditableText } from '../../components/EditableText'
import { RemoveButton } from '../shared.style'
import type { RowState } from './Ordering.style'
import { Grip, Index, Item } from './Ordering.style'

interface SortableItemRowProps {
  /** Позиция в текущем отображаемом порядке (с нуля). */
  index: number
  text: string
  /** Подсветка результата проверки (solve). */
  state?: RowState
  editing: boolean
  /** Ответ зафиксирован (solve, статус не idle): курсоры и hover-акценты выключены. */
  locked?: boolean
  /** Элемент справа: драг-хэндл (edit) или просто иконка (solve / оверлей). */
  handle?: ReactNode
  onTextChange?: (text: string) => void
  onRemove?: () => void
}

/**
 * Презентационная строка элемента порядка: номер позиции, текст, грип/удаление.
 * Ничего не знает о dnd-kit — хэндл приходит готовым элементом, состояние пропсами.
 */
export function SortableItemRow({
  index,
  text,
  state = 'idle',
  editing,
  locked,
  handle,
  onTextChange,
  onRemove,
}: SortableItemRowProps) {
  return (
    <Item $state={state} $editing={editing} $locked={locked}>
      <Index>{index + 1}</Index>
      <EditableText
        className="item-text"
        editing={editing}
        grow
        value={text}
        placeholder="Введите элемент…"
        offset={false}
        onChange={onTextChange}
      />
      {handle ?? <Grip size={17} $locked={locked} />}
      {editing && onRemove && (
        <RemoveButton type="button" aria-label="Удалить элемент" onClick={onRemove}>
          <Trash2 size={15} />
        </RemoveButton>
      )}
    </Item>
  )
}
