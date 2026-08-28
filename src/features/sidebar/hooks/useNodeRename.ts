import { useCallback, useState } from 'react'

interface UseNodeRenameParams {
  /** Сохранение нового имени (уже с тостами ошибок — useStructureActions). */
  onCommit: (id: string, name: string) => Promise<void>
}

/**
 * useNodeRename — состояние инлайн-переименования узла дерева.
 *
 * start(id) включает режим для узла, commit(name) сохраняет и закрывает,
 * cancel() закрывает без сохранения. Пустое имя — закрытие без сохранения.
 */
export function useNodeRename({ onCommit }: UseNodeRenameParams) {
  const [renamingId, setRenamingId] = useState<string | null>(null)

  const start = useCallback((id: string) => setRenamingId(id), [])
  const cancel = useCallback(() => setRenamingId(null), [])

  const commit = useCallback(
    async (name: string) => {
      if (!renamingId) return
      const id = renamingId
      setRenamingId(null)
      if (!name.trim()) return

      await onCommit(id, name)
    },
    [renamingId, onCommit],
  )

  return { renamingId, start, commit, cancel }
}
