import { type MouseEvent, useCallback, useMemo } from 'react'
import { useContextMenu } from '@/features/context-menu'
import { collectFolders, collectSubtreeIds, findNodeById } from '../model/tree-queries'
import type { CourseNode } from '../model/types'

interface UseSidebarContextMenuParams {
  nodes: CourseNode[]
  /** Во время переименования контекстное меню не открывается. */
  renamingId: string | null
}

/**
 * useSidebarContextMenu — контекстное меню узла дерева.
 *
 * Даёт состояние меню (позиция + targetId), целевой узел, папки-приёмники
 * для «Переместить в» (все папки, кроме цели и её поддерева) и обработчик
 * открытия по ПКМ.
 */
export function useSidebarContextMenu({ nodes, renamingId }: UseSidebarContextMenuParams) {
  const { state, openFromEvent, close } = useContextMenu()
  const menuTargetId = state?.targetId ?? null

  const handleNodeContextMenu = useCallback(
    (node: { id: string }, event: MouseEvent) => {
      if (renamingId) return
      openFromEvent(event, node.id)
    },
    [openFromEvent, renamingId],
  )

  /** Целевой узел меню (для действия удаления нужен полный объект). */
  const menuTargetNode = useMemo(
    () => (menuTargetId ? findNodeById(nodes, menuTargetId) : null),
    [nodes, menuTargetId],
  )

  /** Папки-приёмники: все папки дерева, кроме цели и её поддерева. */
  const folderTargets = useMemo(() => {
    const targetSubtree = menuTargetNode ? collectSubtreeIds(menuTargetNode) : null

    return collectFolders(nodes).filter((folder) => !targetSubtree || !targetSubtree.has(folder.id))
  }, [nodes, menuTargetNode])

  return {
    menuState: state,
    menuTargetId,
    menuTargetNode,
    folderTargets,
    handleNodeContextMenu,
    closeMenu: close,
  }
}
