import { useTranslation } from '@mai/i18n'
import { Button, Spinner, Text } from '@mai/theme'
import { FolderPlus, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DeleteNodeModal } from './components/DeleteNodeModal'
import { NodeContextMenu } from './components/NodeContextMenu'
import { useNodeRename } from './hooks/useNodeRename'
import { useSidebarContextMenu } from './hooks/useSidebarContextMenu'
import { useStructure } from './hooks/useStructure'
import { useStructureActions } from './hooks/useStructureActions'
import { findNodeById } from './model/tree-queries'
import type { CourseNode, SidebarAction } from './model/types'
import { CourseSidebar } from './ui/CourseSidebar'
import { CenteredWrap } from './ui/index.style'

export interface CourseSidebarRootProps {
  courseId: string
  courseTitle: string
  courseSubtitle?: string
  /** Выбор ресурса (клик/Enter по узлу-ресурсу). */
  onResourceSelect?: (resourceId: string) => void
}

/**
 * CourseSidebarRoot — связывает entity-стор structure (состояние, атомы)
 * с визуальным слоем (ui/CourseSidebar) и owns UI-состояние фичи:
 * переименование, контекстное меню, подтверждение удаления.
 */
export function CourseSidebarRoot({
  courseId,
  courseTitle,
  courseSubtitle,
  onResourceSelect,
}: CourseSidebarRootProps) {
  const { t } = useTranslation('sidebar')
  const { courseNodes, loading, error } = useStructure(courseId)
  const actions = useStructureActions(courseId)
  const rename = useNodeRename({ onCommit: actions.rename })
  const { menuState, menuTargetNode, folderTargets, handleNodeContextMenu, closeMenu } =
    useSidebarContextMenu({ nodes: courseNodes, renamingId: rename.renamingId })
  const [deleteTarget, setDeleteTarget] = useState<CourseNode | null>(null)

  // ── Toolbar actions ──────────────────────────────────────────────────────
  const toolbarActions = useMemo<SidebarAction[]>(
    () => [
      {
        id: 'create-resource',
        label: t('actions.resource'),
        icon: <Plus size={16} strokeWidth={1.5} />,
        variant: 'primary',
        onSelect: () => void actions.createResource(t('actions.newResource'), null),
      },
      {
        id: 'create-folder',
        label: t('actions.folder'),
        icon: <FolderPlus size={16} strokeWidth={1.5} />,
        variant: 'ghost',
        onSelect: () => void actions.createFolder(t('actions.newFolder'), null),
      },
    ],
    [actions, t],
  )

  // ── Перемещение через контекстное меню ───────────────────────────────────
  /** Переместить цель меню в конец выбранной папки. */
  async function handleMoveToFolder(parentId: string) {
    const id = menuState?.targetId
    if (!id) return

    const parent = findNodeById(courseNodes, parentId)
    closeMenu()
    await actions.move(id, parentId, parent?.children?.length ?? 0)
  }

  // ── Рендер ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <CenteredWrap>
        <Spinner label={t('loading')} />
      </CenteredWrap>
    )
  }

  if (error) {
    return (
      <CenteredWrap>
        <Text color="muted">{t('error.load', { error })}</Text>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          {t('actions.retry')}
        </Button>
      </CenteredWrap>
    )
  }

  return (
    <>
      <CourseSidebar
        courseTitle={courseTitle}
        courseSubtitle={courseSubtitle}
        courseHomeHref={`/course/${courseId}`}
        nodes={courseNodes}
        actions={toolbarActions}
        renamingId={rename.renamingId}
        onSelect={(node) => {
          if (node.type === 'resource') onResourceSelect?.(node.id)
        }}
        onMove={(params) => void actions.move(params.id, params.parentId, params.position)}
        onRenameStart={rename.start}
        onRenameCommit={(name) => void rename.commit(name)}
        onRenameCancel={rename.cancel}
        onDeleteRequest={(node) => setDeleteTarget(node)}
        onNodeContextMenu={handleNodeContextMenu}
      />

      <DeleteNodeModal
        target={deleteTarget}
        onConfirm={actions.remove}
        onClose={() => setDeleteTarget(null)}
      />

      {menuState && (
        <NodeContextMenu
          menuState={menuState}
          folderTargets={folderTargets}
          renamingId={rename.renamingId}
          targetExists={Boolean(menuTargetNode)}
          deleting={deleteTarget !== null}
          onClose={closeMenu}
          onRenameStart={rename.start}
          onMoveToFolder={(folderId) => void handleMoveToFolder(folderId)}
          onDelete={() => {
            if (menuTargetNode) setDeleteTarget(menuTargetNode)
          }}
        />
      )}
    </>
  )
}
