import { useDraggable } from '@dnd-kit/core'
import { Chip } from './MatchingBoard.style'
import { chipDndId } from './model/dnd'

interface DraggableChipProps {
  pairId: string
  text: string
  /** Чип — источник активного перетаскивания: гаснет. */
  dimmed: boolean
}

/** Фишка-определение: draggable-обёртка над презентационным Chip. */
export function DraggableChip({ pairId, text, dimmed }: DraggableChipProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: chipDndId(pairId) })

  return (
    <Chip ref={setNodeRef} {...attributes} {...listeners} $dragging={dimmed}>
      {text}
    </Chip>
  )
}
