import { type MouseEvent, useMemo, useState } from 'react'
import {
  Aside,
  ClearButton,
  CourseTitle,
  Header,
  HeaderText,
  Mark,
  MarkLink,
  Meta,
  Scroll,
  SearchIconSlot,
  SearchInput,
  SearchRow,
} from './CourseSidebar.style'
import { CourseTree } from './CourseTree'
import { CloseIcon, SearchIcon } from './icons'
import { SidebarActions } from './SidebarActions'
import type { CourseNode, SidebarAction } from './types'

export interface CourseSidebarProps {
  courseTitle: string
  /** Подпись под названием: автор, поток, статус курса. */
  courseSubtitle?: string
  /** Если задан, круглая метка курса становится ссылкой на обзор курса (роут /course/:courseId). */
  courseHomeHref?: string
  nodes: CourseNode[]
  actions?: SidebarAction[]
  /** Сколько действий показывать кнопками до сворачивания в «…». */
  maxVisibleActions?: number
  selectedId?: string | null
  defaultExpandedIds?: string[]
  searchable?: boolean
  /** Разрешить перетаскивание ресурсов и групп (drag-and-drop). По умолчанию включено. */
  draggable?: boolean
  /** ID узла в режиме инлайн-переименования. */
  renamingId?: string | null
  onSelect?: (node: CourseNode) => void
  /** Вызывается с параметрами перемещения после drop. */
  onMove?: (params: { id: string; parentId: string | null; position: number }) => void
  onRenameStart?: (id: string) => void
  onRenameCommit?: (name: string) => void
  onRenameCancel?: () => void
  onDeleteRequest?: (node: CourseNode) => void
  /** ПКМ по узлу дерева: открыть контекстное меню. */
  onNodeContextMenu?: (node: CourseNode, event: MouseEvent) => void
  className?: string
}

function countNodes(nodes: CourseNode[]) {
  let resources = 0
  let folders = 0
  const walk = (list: CourseNode[]) => {
    for (const node of list) {
      if (node.type === 'folder') {
        folders += 1
        if (node.children) walk(node.children)
      } else {
        resources += 1
      }
    }
  }
  walk(nodes)

  return { resources, folders }
}
function plural(count: number, forms: [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]

  return forms[2]
}

/**
 * Sidebar структуры курса: заголовок курса, панель действий,
 * поиск и иерархическое дерево «папки + ресурсы».
 *
 * Чисто презентационный компонент — состоянием структуры владеет
 * хост (через useTreeController из пакета @mai/sidebar).
 */
export function CourseSidebar({
  courseTitle,
  courseSubtitle,
  courseHomeHref,
  nodes,
  actions = [],
  maxVisibleActions = 2,
  selectedId: controlledSelectedId,
  defaultExpandedIds = [],
  searchable = true,
  draggable = true,
  renamingId = null,
  onSelect,
  onMove,
  onRenameStart,
  onRenameCommit,
  onRenameCancel,
  onDeleteRequest,
  onNodeContextMenu,
  className,
}: CourseSidebarProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(defaultExpandedIds))
  const [query, setQuery] = useState('')
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId
  const stats = useMemo(() => countNodes(nodes), [nodes])
  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)

      return next
    })
  }
  const handleExpand = (id: string) => {
    setExpandedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)

      return next
    })
  }
  const handleSelect = (node: CourseNode) => {
    if (controlledSelectedId === undefined) setInternalSelectedId(node.id)
    onSelect?.(node)
  }
  const initials = courseTitle
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <Aside className={className} aria-label="Структура курса">
      <Header>
        {courseHomeHref ? (
          <MarkLink to={courseHomeHref} aria-label="К обзору курса" title="К обзору курса">
            <Mark aria-hidden="true">{initials}</Mark>
          </MarkLink>
        ) : (
          <Mark aria-hidden="true">{initials}</Mark>
        )}
        <HeaderText>
          <CourseTitle title={courseTitle}>{courseTitle}</CourseTitle>
          <Meta>
            {courseSubtitle ?? (
              <>
                {stats.resources} {plural(stats.resources, ['ресурс', 'ресурса', 'ресурсов'])} ·{' '}
                {stats.folders} {plural(stats.folders, ['группа', 'группы', 'групп'])}
              </>
            )}
          </Meta>
        </HeaderText>
      </Header>

      {actions.length > 0 && <SidebarActions actions={actions} maxVisible={maxVisibleActions} />}

      {searchable && (
        <SearchRow>
          <SearchIconSlot>
            <SearchIcon />
          </SearchIconSlot>
          <SearchInput
            type="search"
            value={query}
            placeholder="Поиск по структуре"
            aria-label="Поиск по структуре курса"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <ClearButton type="button" aria-label="Очистить поиск" onClick={() => setQuery('')}>
              <CloseIcon />
            </ClearButton>
          )}
        </SearchRow>
      )}

      <Scroll>
        <CourseTree
          nodes={nodes}
          query={query}
          selectedId={selectedId}
          expandedIds={expandedIds}
          renamingId={renamingId}
          onSelect={handleSelect}
          onToggle={handleToggle}
          onExpand={handleExpand}
          onMove={draggable ? onMove : undefined}
          onRenameStart={(id) => onRenameStart?.(id)}
          onRenameCommit={(name) => onRenameCommit?.(name)}
          onRenameCancel={() => onRenameCancel?.()}
          onDeleteRequest={(node) => onDeleteRequest?.(node)}
          onNodeContextMenu={(node, event) => onNodeContextMenu?.(node, event)}
        />
      </Scroll>
    </Aside>
  )
}
