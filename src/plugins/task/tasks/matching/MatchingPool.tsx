import { useDroppable } from '@dnd-kit/core'
import type { MatchPair } from '../../core/types'
import { DraggableChip } from './DraggableChip'
import { Pool, PoolHint } from './MatchingBoard.style'
import { POOL_ID } from './model/dnd'

interface MatchingPoolProps {
  /** Свободные фишки: определения, не приставленные ни к одному термину. */
  pairs: MatchPair[]
  dragPairId: string | null
  /** Ответ зафиксирован: фишки в пуле не перетаскиваются. */
  locked?: boolean
}

/** Пул: droppable-зона свободных фишек-определений. */
export function MatchingPool({ pairs, dragPairId, locked }: MatchingPoolProps) {
  const { isOver, setNodeRef } = useDroppable({ id: POOL_ID })

  return (
    <Pool ref={setNodeRef} $over={isOver}>
      {pairs.map((pair) => (
        <DraggableChip
          key={pair.id}
          pairId={pair.id}
          text={pair.right}
          dimmed={dragPairId === pair.id}
          locked={locked}
        />
      ))}
      {pairs.length === 0 && <PoolHint>Все определения распределены</PoolHint>}
    </Pool>
  )
}
