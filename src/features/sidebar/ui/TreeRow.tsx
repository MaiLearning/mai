import { forwardRef, type MouseEvent, useEffect, useRef, useState } from 'react'
import type { DropKind } from '../model/dnd'
import type { GuideSegment } from '../model/tree-utils'
import type { CourseNode } from '../model/types'
import { ChevronIcon, FolderIcon, FolderOpenIcon, ResourceIcon, TrashIcon } from './icons'
import {
  Badge,
  DeleteButton,
  Guide,
  NodeIcon,
  RenameInput,
  ROW_INDENT,
  Row,
  Title,
  Twisty,
} from './TreeRow.style'

interface TreeRowProps {
  node: CourseNode
  level: number
  expanded: boolean
  selected: boolean
  focused: boolean
  hasChildren: boolean
  /** Активный режим инлайн-переименования (double-click по заголовку). */
  isRenaming: boolean
  onToggle: () => void
  onSelect: () => void
  onFocusRow: () => void
  onRenameStart: () => void
  onRenameCommit: (name: string) => void
  onRenameCancel: () => void
  onDeleteRequest: () => void
  /** ПКМ по строке: открыть контекстное меню узла (не в overlay-режиме). */
  onNodeContextMenu?: (event: MouseEvent<HTMLDivElement>) => void
  /** Строка рендерится внутри DragOverlay (плавающая копия за курсором). */
  overlay?: boolean
  /** Приглушить исходную строку, пока идёт перетаскивание. */
  dimmed?: boolean
  /** Активная зона дропа на этой строке: линия вставки или подсветка папки. */
  dropKind?: DropKind | null
  /** Направляющие линии этой строки (см. computeGuideLevels). */
  guideLevels?: GuideSegment[]
}

/**
 * Одна строка дерева. Полностью презентационный компонент:
 * состояние (раскрытие / выделение / фокус / переименование) приходит сверху.
 *
 * Двойной клик по заголовку → инлайн-переименование.
 * Кнопка удаления появляется при наведении (не в overlay-режиме).
 */
export const TreeRow = forwardRef<HTMLDivElement, TreeRowProps>(function TreeRow(
  {
    node,
    level,
    expanded,
    selected,
    focused,
    hasChildren,
    isRenaming,
    onToggle,
    onSelect,
    onFocusRow,
    onRenameStart,
    onRenameCommit,
    onRenameCancel,
    onDeleteRequest,
    onNodeContextMenu,
    overlay = false,
    dimmed = false,
    dropKind = null,
    guideLevels = [],
  },
  ref,
) {
  const isFolder = node.type === 'folder'
  const [renameValue, setRenameValue] = useState(node.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming) {
      setRenameValue(node.title)
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    }
  }, [isRenaming, node.title])

  return (
    <Row
      ref={ref}
      role="treeitem"
      aria-level={level + 1}
      aria-selected={selected}
      aria-expanded={isFolder ? expanded : undefined}
      tabIndex={focused ? 0 : -1}
      $selected={selected}
      $indent={level * ROW_INDENT}
      $overlay={overlay}
      $dimmed={dimmed}
      $dropInside={dropKind === 'inside'}
      $dropLine={dropKind === 'before' || dropKind === 'after' ? dropKind : null}
      onFocus={onFocusRow}
      onContextMenu={!overlay && !isRenaming ? onNodeContextMenu : undefined}
      onClick={() => {
        onSelect()
        if (isFolder) onToggle()
      }}
    >
      {/* Направляющие — первый контент строки: фон красится под линией,
          шеврон и иконки — над ней. */}
      {guideLevels.map((segment) => (
        <Guide
          key={segment.level}
          $level={segment.level}
          $end={segment.end}
          $indent={level * ROW_INDENT}
          aria-hidden="true"
        />
      ))}

      <Twisty
        as="span"
        role="presentation"
        $visible={isFolder && hasChildren}
        $expanded={expanded}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
      >
        <ChevronIcon />
      </Twisty>

      <NodeIcon $folder={isFolder}>
        {isFolder ? expanded ? <FolderOpenIcon /> : <FolderIcon /> : <ResourceIcon />}
      </NodeIcon>

      {isRenaming ? (
        <RenameInput
          ref={inputRef}
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.stopPropagation()
              onRenameCommit(renameValue.trim())
            }
            if (event.key === 'Escape') {
              event.stopPropagation()
              onRenameCancel()
            }
          }}
          onBlur={() => onRenameCommit(renameValue.trim())}
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <Title $folder={isFolder} onDoubleClick={() => onRenameStart()}>
          {node.title}
        </Title>
      )}

      {node.badge && <Badge $tone={node.badgeTone ?? 'neutral'}>{node.badge}</Badge>}

      {!overlay && !isRenaming && (
        <DeleteButton
          type="button"
          aria-label="Удалить"
          onClick={(event) => {
            event.stopPropagation()
            onDeleteRequest()
          }}
        >
          <TrashIcon />
        </DeleteButton>
      )}
    </Row>
  )
})
