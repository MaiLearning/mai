import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CheckStatus, MatchingAnswer, MatchingTask } from '../../core/types'
import { seededShuffle } from '../../lib/seeded-shuffle'
import { Field, SectionLabel } from '../shared.style'
import { Chip } from './MatchingBoard.style'
import { MatchingPool } from './MatchingPool'
import { MatchingRow } from './MatchingRow'
import { assign, chipOwner, unassign } from './model/assign'
import { POOL_ID, parseChipPairId, parseSlotPairId } from './model/dnd'

interface MatchingBoardProps {
  task: MatchingTask
  status: CheckStatus
  answer?: MatchingAnswer
  onAnswer?: (answer: MatchingAnswer) => void
}

/** Доска прохождения: строки «термин → слот» + пул свободных фишек, dnd-kit. */
export function MatchingBoard({ task, status, answer, onAnswer }: MatchingBoardProps) {
  const mapping = useMemo(() => (answer?.kind === 'Matching' ? answer.mapping : {}), [answer])
  const [dragPairId, setDragPairId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  )
  // Пул: определения без владельца, в стабильном между сессиями порядке.
  const poolPairs = useMemo(
    () => seededShuffle(task.pairs, task.id).filter((p) => chipOwner(mapping, p.id) === null),
    [task, mapping],
  )

  const resetDrag = useCallback(() => {
    setDragPairId(null)
    document.body.style.cursor = ''
  }, [])
  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragPairId(parseChipPairId(String(active.id)))
    document.body.style.cursor = 'grabbing'
  }
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const chipPairId = parseChipPairId(String(active.id))
    resetDrag()
    if (!over) return

    const slotPairId = parseSlotPairId(String(over.id))
    if (slotPairId) {
      const next = assign(mapping, slotPairId, chipPairId)
      if (next !== mapping) onAnswer?.({ kind: 'Matching', mapping: next })

      return
    }
    if (String(over.id) === POOL_ID) {
      const owner = chipOwner(mapping, chipPairId)
      if (owner) onAnswer?.({ kind: 'Matching', mapping: unassign(mapping, owner) })
    }
  }

  const dragPair = dragPairId ? (task.pairs.find((p) => p.id === dragPairId) ?? null) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={resetDrag}
    >
      <Field>
        <SectionLabel>Сопоставьте пары: перетащите определения к терминам</SectionLabel>
        {task.pairs.map((pair) => {
          const held = task.pairs.find((p) => p.id === mapping[pair.id]) ?? null
          const state =
            status === 'idle' ? 'idle' : mapping[pair.id] === pair.id ? 'correct' : 'incorrect'

          return (
            <MatchingRow
              key={pair.id}
              pair={pair}
              held={held}
              state={state}
              dragPairId={dragPairId}
            />
          )
        })}
        <MatchingPool pairs={poolPairs} dragPairId={dragPairId} />
      </Field>
      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={null}>
            {dragPair ? <Chip>{dragPair.right}</Chip> : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}
