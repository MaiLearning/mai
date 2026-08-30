import { useDroppable } from '@dnd-kit/core'
import type { MatchPair } from '../../core/types'
import { DraggableChip } from './DraggableChip'
import { RowSlot, Slot, SlotPlaceholder, Term } from './MatchingBoard.style'
import { slotDndId } from './model/dnd'

type SlotState = 'idle' | 'correct' | 'incorrect'

interface MatchingRowProps {
  pair: MatchPair
  /** Приставленная фишка (пара, чьё определение стоит в слоте) или null. */
  held: MatchPair | null
  /** Визуальное состояние слота после проверки. */
  state: SlotState
  /** id пары активного перетаскивания: гасит фишку-источник. */
  dragPairId: string | null
}

/** Строка доски: термин + слот-дроп-зона с фишкой или плейсхолдером. */
export function MatchingRow({ pair, held, state, dragPairId }: MatchingRowProps) {
  const { isOver, setNodeRef } = useDroppable({ id: slotDndId(pair.id) })

  return (
    <RowSlot>
      <Term>{pair.left}</Term>
      <Slot ref={setNodeRef} $state={state} $over={isOver}>
        {held ? (
          <DraggableChip pairId={held.id} text={held.right} dimmed={dragPairId === held.id} />
        ) : (
          <SlotPlaceholder>Перетащите определение</SlotPlaceholder>
        )}
      </Slot>
    </RowSlot>
  )
}
