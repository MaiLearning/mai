import { useDraggable } from '@dnd-kit/core'
import { Chip } from './MatchingBoard.style'
import { chipDndId } from './model/dnd'

interface DraggableChipProps {
  pairId: string
  text: string
  /** Чип — источник активного перетаскивания: гаснет. */
  dimmed: boolean
  /** Ответ зафиксирован: dnd-kit listeners/attributes не подключаются. */
  locked?: boolean
}

/** Фишка-определение: draggable-обёртка над презентационным Chip. */
export function DraggableChip({ pairId, text, dimmed, locked }: DraggableChipProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: chipDndId(pairId) })

  return (
    <Chip
      ref={setNodeRef}
      {...(locked ? {} : { ...attributes, ...listeners })}
      $dragging={dimmed}
      $locked={locked}
    >
      {text}
    </Chip>
  )
}
