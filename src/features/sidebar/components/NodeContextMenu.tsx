import { FolderInput, Pen } from 'lucide-react'
import { ContextMenu } from '@/features/context-menu'
import type { MenuState } from '@/features/context-menu/useContextMenu'

interface NodeContextMenuProps {
  menuState: MenuState<string>
  /** Папки-приёмники для «Переместить в». */
  folderTargets: { id: string; title: string }[]
  renamingId: string | null
  /** Найден ли целевой узел меню в дереве (иначе удаление недоступно). */
  targetExists: boolean
  /** Идёт процесс удаления — блокировать действия. */
  deleting: boolean
  onClose: () => void
  onRenameStart: (id: string) => void
  onMoveToFolder: (folderId: string) => void
  onDelete: () => void
}

/**
 * Контекстное меню узла дерева: переименовать (F2),
 * переместить в папку, удалить.
 */
export function NodeContextMenu({
  menuState,
  folderTargets,
  renamingId,
  targetExists,
  deleting,
  onClose,
  onRenameStart,
  onMoveToFolder,
  onDelete,
}: NodeContextMenuProps) {
  const targetId = menuState.targetId

  return (
    <ContextMenu
      opened
      x={menuState.x}
      y={menuState.y}
      onClose={onClose}
      onDelete={targetExists && !deleting ? onDelete : undefined}
    >
      <ContextMenu.Item
        label="Переименовать"
        icon={<Pen size={16} strokeWidth={1.5} />}
        hotkey="F2"
        disabled={!targetId || renamingId !== null}
        onSelect={() => {
          if (targetId) onRenameStart(targetId)
        }}
      />
      <ContextMenu.Sub label="Переместить в" icon={<FolderInput size={16} strokeWidth={1.5} />}>
        {folderTargets.length > 0 ? (
          folderTargets.map((folder) => (
            <ContextMenu.Item
              key={folder.id}
              label={folder.title}
              onSelect={() => onMoveToFolder(folder.id)}
            />
          ))
        ) : (
          <ContextMenu.Item label="Нет доступных папок" disabled />
        )}
      </ContextMenu.Sub>
    </ContextMenu>
  )
}
