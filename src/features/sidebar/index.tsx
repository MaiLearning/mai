import { SidebarProvider, useTreeController } from '@mai/sidebar'
import { FolderInput, FolderPlus, Pen, Plus } from 'lucide-react'
import { type MouseEvent, useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button, Modal, Spinner, Text } from '@/app/theme/components'
import { ContextMenu, useContextMenu } from '@/features/context-menu'
import { sidebarApi } from './api'
import { CourseSidebar as CourseSidebarView } from './CourseSidebar'
import { toCourseNodes } from './convert'
import { CenteredWrap } from './index.style'
import type { CourseNode, SidebarAction } from './types'

// ================================================================
//  Публичный API фичи
// ================================================================

export interface CourseSidebarRootProps {
  courseId: string
  courseTitle: string
  courseSubtitle?: string
  /** Выбор ресурса (клик/Enter по узлу-ресурсу). */
  onResourceSelect?: (resourceId: string) => void
}

/**
 * CourseSidebar — готовый к использованию компонент sidebar-а.
 *
 * Оборачивает визуальный слой (дизайн) в DI-провайдер пакета @mai/sidebar
 * и связывает с data-слоем app/mai (entities/structure + entities/directory).
 */
export function CourseSidebar(props: CourseSidebarRootProps) {
  return (
    <SidebarProvider deps={{ api: sidebarApi }}>
      <CourseSidebarConnected {...props} />
    </SidebarProvider>
  )
}

// ================================================================
//  Внутренний: связывает контроллер с визуалом
// ================================================================

function CourseSidebarConnected({
  courseId,
  courseTitle,
  courseSubtitle,
  onResourceSelect,
}: CourseSidebarRootProps) {
  const controller = useTreeController(courseId)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CourseNode | null>(null)
  const [deleting, setDeleting] = useState(false)
  const nodes = useMemo(() => toCourseNodes(controller.nodes), [controller.nodes])

  // ── Контекстное меню дерева ─────────────────────────────────────────────
  const menu = useContextMenu()
  const menuState = menu.state
  const menuTargetId = menuState?.targetId ?? null

  const handleNodeContextMenu = useCallback(
    (node: { id: string }, event: MouseEvent) => {
      if (renamingId) return
      menu.openFromEvent(event, node.id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renamingId],
  )

  /** Целевой узел меню (для действия удаления нужен полный объект). */
  const menuTargetNode = useMemo(
    () => (menuTargetId ? findNodeById(nodes, menuTargetId) : null),
    [nodes, menuTargetId],
  )

  /**
   * Папки-приёмники для «Переместить в»: все папки дерева,
   * кроме самой цели и её поддерева.
   */
  const folderTargets = useMemo(() => {
    const targetSubtree = menuTargetNode ? collectSubtreeIds(menuTargetNode) : null

    return collectFolders(nodes).filter((folder) => !targetSubtree || !targetSubtree.has(folder.id))
  }, [nodes, menuTargetNode])
  // ── Toolbar actions ──────────────────────────────────────────────────────
  const actions = useMemo<SidebarAction[]>(
    () => [
      {
        id: 'create-resource',
        label: 'Ресурс',
        icon: <Plus size={16} strokeWidth={1.5} />,
        variant: 'primary',
        onSelect: () => void handleCreateResource(),
      },
      {
        id: 'create-folder',
        label: 'Папка',
        icon: <FolderPlus size={16} strokeWidth={1.5} />,
        variant: 'ghost',
        onSelect: () => void handleCreateFolder(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courseId],
  )

  // ── Создание ─────────────────────────────────────────────────────────────
  async function handleCreateResource() {
    try {
      await controller.createResource('Новый ресурс', null, null)
    } catch (e) {
      toast.error('Не удалось создать ресурс', {
        description: e instanceof Error ? e.message : String(e),
      })
    }
  }
  async function handleCreateFolder() {
    try {
      await controller.create('Новая папка', null)
    } catch (e) {
      toast.error('Не удалось создать папку', {
        description: e instanceof Error ? e.message : String(e),
      })
    }
  }
  // ── DnD ──────────────────────────────────────────────────────────────────
  async function handleMove(params: { id: string; parentId: string | null; position: number }) {
    try {
      await controller.move(params.id, params.parentId, params.position)
    } catch (e) {
      toast.error('Не удалось переместить элемент', {
        description: e instanceof Error ? e.message : String(e),
      })
    }
  }
  // ── Переименование ───────────────────────────────────────────────────────
  function handleRenameStart(id: string) {
    const item = controller.tree.getItem(id)
    if (!item) return
    setRenamingId(id)
  }
  async function handleRenameCommit(name: string) {
    if (!renamingId || !name.trim()) {
      setRenamingId(null)

      return
    }
    const id = renamingId
    setRenamingId(null)
    try {
      await controller.rename(id, name)
    } catch (e) {
      toast.error('Не удалось переименовать', {
        description: e instanceof Error ? e.message : String(e),
      })
    }
  }
  function handleRenameCancel() {
    setRenamingId(null)
  }
  // ── Перемещение через контекстное меню ─────────────────────────────────
  /** Переместить цель меню в конец выбранной папки. */
  async function handleMoveToFolder(parentId: string) {
    const id = menuState?.targetId
    if (!id) return

    const parent = findNodeById(nodes, parentId)
    await handleMove({ id, parentId, position: parent?.children?.length ?? 0 })
  }
  // ── Удаление ─────────────────────────────────────────────────────────────
  function handleDeleteRequest(node: CourseNode) {
    setDeleteTarget(node)
  }
  async function handleDeleteConfirm() {
    if (!deleteTarget || deleting) return
    setDeleting(true)
    try {
      await controller.remove(deleteTarget.id)
      setDeleteTarget(null)
    } catch (e) {
      toast.error('Не удалось удалить элемент', {
        description: e instanceof Error ? e.message : String(e),
      })
    } finally {
      setDeleting(false)
    }
  }

  // ── Рендер ───────────────────────────────────────────────────────────────
  if (controller.loading) {
    return (
      <CenteredWrap>
        <Spinner label="Загрузка структуры" />
      </CenteredWrap>
    )
  }

  if (controller.error) {
    return (
      <CenteredWrap>
        <Text muted>Ошибка загрузки: {controller.error}</Text>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Перегрузить
        </Button>
      </CenteredWrap>
    )
  }

  return (
    <>
      <CourseSidebarView
        courseTitle={courseTitle}
        courseSubtitle={courseSubtitle}
        courseHomeHref={`/course/${courseId}`}
        nodes={nodes}
        actions={actions}
        renamingId={renamingId}
        onSelect={(node) => {
          if (node.type === 'resource') onResourceSelect?.(node.id)
        }}
        onMove={handleMove}
        onRenameStart={handleRenameStart}
        onRenameCommit={handleRenameCommit}
        onRenameCancel={handleRenameCancel}
        onDeleteRequest={handleDeleteRequest}
        onNodeContextMenu={handleNodeContextMenu}
      />

      <Modal
        opened={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        dismissible={!deleting}
        title="Подтверждение удаления"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={() => void handleDeleteConfirm()}
              disabled={deleting}
            >
              {deleting ? <Spinner label="Удаление" /> : 'Удалить'}
            </Button>
          </>
        }
      >
        <Text>
          {deleteTarget?.type === 'folder'
            ? `Удалить папку «${deleteTarget?.title}» и всё её содержимое?`
            : `Удалить ресурс «${deleteTarget?.title}»?`}
        </Text>
      </Modal>

      {menuState && (
        <ContextMenu
          opened
          x={menuState.x}
          y={menuState.y}
          onClose={menu.close}
          onDelete={
            menuTargetNode && !deleting ? () => handleDeleteRequest(menuTargetNode) : undefined
          }
        >
          <ContextMenu.Item
            label="Переименовать"
            icon={<Pen size={16} strokeWidth={1.5} />}
            hotkey="F2"
            disabled={!menuTargetId || renamingId !== null}
            onSelect={() => {
              if (menuTargetId) handleRenameStart(menuTargetId)
            }}
          />
          <ContextMenu.Sub label="Переместить в" icon={<FolderInput size={16} strokeWidth={1.5} />}>
            {folderTargets.length > 0 ? (
              folderTargets.map((folder) => (
                <ContextMenu.Item
                  key={folder.id}
                  label={folder.title}
                  onSelect={() => void handleMoveToFolder(folder.id)}
                />
              ))
            ) : (
              <ContextMenu.Item label="Нет доступных папок" disabled />
            )}
          </ContextMenu.Sub>
        </ContextMenu>
      )}
    </>
  )
}

// ================================================================
//  Вспомогательный поиск по дереву узлов
// ================================================================

/** Найти узел по id в глубину (дерево маленькое — рекурсия достаточна). */
function findNodeById(nodes: CourseNode[], id: string): CourseNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }

  return null
}

/** Собрать множество id целевого узла и всех его потомков. */
function collectSubtreeIds(node: CourseNode, acc: Set<string> = new Set()): Set<string> {
  acc.add(node.id)
  for (const child of node.children ?? []) collectSubtreeIds(child, acc)

  return acc
}

/** Плоский список всех папок дерева (в порядке обхода сверху вниз). */
function collectFolders(
  nodes: CourseNode[],
  acc: { id: string; title: string }[] = [],
): { id: string; title: string }[] {
  for (const node of nodes) {
    if (node.type !== 'folder') continue
    acc.push({ id: node.id, title: node.title })
    if (node.children) collectFolders(node.children, acc)
  }

  return acc
}

// ================================================================
//  Реэкспорты
// ================================================================

export type { SidebarApi } from '@mai/sidebar'
export type { CourseSidebarProps } from './CourseSidebar'
export type { CourseNode, CourseNodeType, SidebarAction } from './types'
