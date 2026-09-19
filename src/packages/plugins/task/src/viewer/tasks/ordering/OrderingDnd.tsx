import type { DraggableAttributes } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

/** Пропсы драг-хэндла (грипа): aria-атрибуты и слушатели dnd-kit. */
export type DragHandleProps = DraggableAttributes & SyntheticListenerMap

interface OrderingDndProps {
  /** Id элементов в текущем отображаемом порядке. */
  ids: string[]
  /** Перестановка массива: from → to (индексы в ids). */
  onReorder: (from: number, to: number) => void
  /** Копия перетаскиваемой строки для DragOverlay. */
  overlayFor: (id: string) => ReactNode
  children: ReactNode
}

/** DndContext + SortableContext + DragOverlay для сортируемого списка задачи. */
export function OrderingDnd({ ids, onReorder, overlayFor, children }: OrderingDndProps) {
  const [dragId, setDragId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => setDragId(String(active.id))

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDragId(null)
    if (!over) return
    const from = ids.indexOf(String(active.id))
    const to = ids.indexOf(String(over.id))
    if (from < 0 || to < 0 || from === to) return
    onReorder(from, to)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragId(null)}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={null}>{dragId ? overlayFor(dragId) : null}</DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}

interface SortableRowProps {
  id: string
  wholeRowDrag: boolean
  /** Заперт: пропсы драг-хэндла не отдаются ни строке, ни грипу. */
  disabled?: boolean
  /** handle — пропсы драг-хэндла для грипа строки. */
  children: (handle?: DragHandleProps) => ReactNode
}

/**
 * Обёртка сортируемой строки: transform/transition и приглушение источника.
 * Transform возвращённый dnd-kit применяется как есть: при DragOverlay источник
 * сам сдвигается к целевой позиции (поведение sortable), копия летит за курсором.
 */
export function SortableRow({ id, wholeRowDrag, disabled, children }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })
  const handle = disabled ? undefined : ({ ...attributes, ...listeners } as DragHandleProps)

  return (
    <div
      ref={setNodeRef}
      {...(wholeRowDrag && handle ? handle : undefined)}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : undefined,
      }}
    >
      {children(handle)}
    </div>
  )
}
