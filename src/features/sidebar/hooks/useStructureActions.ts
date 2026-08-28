import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
  createDirectoryAtom,
  createResourceAtom,
  deleteNodeAtom,
  moveNodeAtom,
  renameNodeAtom,
} from '@/entities/structure'

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * useStructureActions — обёртки над action-атомами entity-стора structure.
 *
 * Ошибки операций логируются в атомах; здесь они ловятся и показываются
 * пользователю через toast. Все функции стабильны (useCallback).
 */
export function useStructureActions(courseId: string) {
  const createDirectory = useSetAtom(createDirectoryAtom)
  const invokeCreateResource = useSetAtom(createResourceAtom)
  const invokeMoveNode = useSetAtom(moveNodeAtom)
  const invokeRenameNode = useSetAtom(renameNodeAtom)
  const invokeDeleteNode = useSetAtom(deleteNodeAtom)

  /** Создать папку (parentId = null — в корень). */
  const createFolder = useCallback(
    async (name: string, parentId: string | null): Promise<void> => {
      try {
        await createDirectory({ courseId, name, parentId })
      } catch (e) {
        toast.error('Не удалось создать папку', { description: errorMessage(e) })
      }
    },
    [courseId, createDirectory],
  )

  /** Создать ресурс (parentId = null — в корень). */
  const createResource = useCallback(
    async (name: string, parentId: string | null, typeKey?: string | null): Promise<void> => {
      try {
        await invokeCreateResource({ courseId, name, parentId, typeKey: typeKey ?? null })
      } catch (e) {
        toast.error('Не удалось создать ресурс', { description: errorMessage(e) })
      }
    },
    [courseId, invokeCreateResource],
  )

  /** Переместить узел в папку/позицию. */
  const move = useCallback(
    async (id: string, parentId: string | null, position: number): Promise<void> => {
      try {
        await invokeMoveNode({ nodeId: id, newParentId: parentId, position })
      } catch (e) {
        toast.error('Не удалось переместить элемент', { description: errorMessage(e) })
      }
    },
    [invokeMoveNode],
  )

  /** Переименовать узел. */
  const rename = useCallback(
    async (id: string, name: string): Promise<void> => {
      try {
        await invokeRenameNode({ nodeId: id, name })
      } catch (e) {
        toast.error('Не удалось переименовать', { description: errorMessage(e) })
      }
    },
    [invokeRenameNode],
  )

  /** Удалить узел (папка — вместе с содержимым). */
  const remove = useCallback(
    async (id: string): Promise<void> => {
      try {
        await invokeDeleteNode(id)
      } catch (e) {
        toast.error('Не удалось удалить элемент', { description: errorMessage(e) })
      }
    },
    [invokeDeleteNode],
  )

  return useMemo(
    () => ({ createFolder, createResource, move, rename, remove }),
    [createFolder, createResource, move, rename, remove],
  )
}
