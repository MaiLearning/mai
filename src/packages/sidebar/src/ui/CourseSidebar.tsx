import { useTranslation } from '@mai/i18n'
import { Input } from '@mai/theme'
import { type MouseEvent, useMemo, useState } from 'react'
import { useSidebarSearch } from '../hooks/useSidebarSearch'
import { countNodes } from '../model/tree-queries'
import type { CourseNode, SidebarAction } from '../model/types'
import {
  Aside,
  ClearButton,
  CourseTitle,
  Footer,
  Header,
  HeaderText,
  Main,
  Mark,
  MarkLink,
  Meta,
  SearchWrap,
} from './CourseSidebar.style'
import { CourseTree } from './CourseTree'
import { CloseIcon, SearchIcon } from './icons'
import { SidebarActions } from './SidebarActions'

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

/**
 * Sidebar структуры курса: заголовок курса в header, поиск и
 * иерархическое дерево «папки + ресурсы» в main, панель действий
 * в footer.
 *
 * Чисто презентационный компонент — состоянием структуры владеет
 * стор пакета @mai/structure (@mai/sidebar связывает его с этим UI).
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
  const { t } = useTranslation('sidebar')
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(defaultExpandedIds))
  const { query, setQuery, clear: clearQuery } = useSidebarSearch()
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
    <Aside className={className} aria-label={t('header.structureAria')}>
      <Header>
        {courseHomeHref ? (
          <MarkLink
            href={courseHomeHref}
            aria-label={t('header.courseOverview')}
            title={t('header.courseOverview')}
          >
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
                {t('header.meta.resources', { count: stats.resources })} ·{' '}
                {t('header.meta.folders', { count: stats.folders })}
              </>
            )}
          </Meta>
        </HeaderText>
      </Header>

      <Main>
        {searchable && (
          <SearchWrap>
            <Input
              type="search"
              size="sm"
              value={query}
              placeholder={t('search.placeholder')}
              aria-label={t('search.aria')}
              startContent={<SearchIcon />}
              endContent={
                query ? (
                  <ClearButton type="button" aria-label={t('search.clear')} onClick={clearQuery}>
                    <CloseIcon />
                  </ClearButton>
                ) : undefined
              }
              onChange={(event) => setQuery(event.target.value)}
            />
          </SearchWrap>
        )}

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
      </Main>

      {actions.length > 0 && (
        <Footer>
          <SidebarActions actions={actions} maxVisible={maxVisibleActions} />
        </Footer>
      )}
    </Aside>
  )
}
