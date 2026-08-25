import { SidebarProvider, useTreeController } from '@mai/sidebar'
import { FolderPlus, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button, Modal, Spinner, Text } from '@/app/theme/components'
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
    </>
  )
}

// ================================================================
//  Реэкспорты
// ================================================================

export type { SidebarApi } from '@mai/sidebar'
export type { CourseSidebarProps } from './CourseSidebar'
export type { CourseNode, CourseNodeType, SidebarAction } from './types'
