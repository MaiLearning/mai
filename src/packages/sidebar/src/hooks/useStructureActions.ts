import { useTranslation } from '@mai/i18n'
import { notifyError } from '@mai/notifications'
import {
  createDirectoryAtom,
  createResourceAtom,
  deleteNodeAtom,
  moveNodeAtom,
  renameNodeAtom,
} from '@mai/structure'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * useStructureActions — обёртки над action-атомами entity-стора structure.
 *
 * Ошибки операций логируются в атомах; здесь они ловятся и показываются
 * пользователю через уведомление. Все функции стабильны (useCallback).
 */
export function useStructureActions(courseId: string) {
  const { t } = useTranslation('sidebar')
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
        notifyError(t('errors.createFolder'), errorMessage(e))
      }
    },
    [courseId, createDirectory, t],
  )

  /** Создать ресурс (parentId = null — в корень). */
  const createResource = useCallback(
    async (name: string, parentId: string | null, typeKey?: string | null): Promise<void> => {
      try {
        await invokeCreateResource({ courseId, name, parentId, typeKey: typeKey ?? null })
      } catch (e) {
        notifyError(t('errors.createResource'), errorMessage(e))
      }
    },
    [courseId, invokeCreateResource, t],
  )

  /** Переместить узел в папку/позицию. */
  const move = useCallback(
    async (id: string, parentId: string | null, position: number): Promise<void> => {
      try {
        await invokeMoveNode({ nodeId: id, newParentId: parentId, position })
      } catch (e) {
        notifyError(t('errors.move'), errorMessage(e))
      }
    },
    [invokeMoveNode, t],
  )

  /** Переименовать узел. */
  const rename = useCallback(
    async (id: string, name: string): Promise<void> => {
      try {
        await invokeRenameNode({ nodeId: id, name })
      } catch (e) {
        notifyError(t('errors.rename'), errorMessage(e))
      }
    },
    [invokeRenameNode, t],
  )

  /** Удалить узел (папка — вместе с содержимым). */
  const remove = useCallback(
    async (id: string): Promise<void> => {
      try {
        await invokeDeleteNode(id)
      } catch (e) {
        notifyError(t('errors.delete'), errorMessage(e))
      }
    },
    [invokeDeleteNode, t],
  )

  return useMemo(
    () => ({ createFolder, createResource, move, rename, remove }),
    [createFolder, createResource, move, rename, remove],
  )
}
