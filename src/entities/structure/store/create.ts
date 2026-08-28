import { info, error as logError } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import { createDirectory as createDirectoryService } from '../../directory/services'
import type { StructureNodeFlat } from '../core/model'
import { createResourceInStructure } from '../services'
import { ROOT_ID } from '../tree'
import { CreateAction } from './actions'
import { structureFlatByIdAtom, toTreeNode } from './atoms'
import { executeAction } from './history'

interface CreateNodeInput {
  courseId: string
  name: string
  parentId?: string | null
}

/**
 * createDirectoryAtom — создание новой папки.
 *
 * Backend-first: сначала createDirectory (возвращает готовый узел с ID),
 * затем CreateAction в историю и дерево. sendDo у CreateAction — no-op
 * (узел уже создан на backend).
 */
export const createDirectoryAtom = atom(
  null,
  async (get, set, input: CreateNodeInput): Promise<StructureNodeFlat> => {
    try {
      const flat = await createDirectoryService({
        courseId: input.courseId,
        name: input.name,
        parentId: input.parentId ?? null,
      })
      const action = new CreateAction(toTreeNode(flat), flat.parentId ?? ROOT_ID, flat.position)
      executeAction(get, set, action)
      set(structureFlatByIdAtom, (prev) => ({ ...prev, [flat.id]: flat }))
      info(`Папка создана: ${flat.id}`)

      return flat
    } catch (e) {
      logError(`Не удалось создать папку: ${e instanceof Error ? e.message : String(e)}`)
      throw e
    }
  },
)

export interface CreateResourceInput extends CreateNodeInput {
  typeKey?: string | null
}

/**
 * createResourceAtom — создание нового ресурса.
 *
 * Backend-first аналогично createDirectory.
 */
export const createResourceAtom = atom(
  null,
  async (get, set, input: CreateResourceInput): Promise<StructureNodeFlat> => {
    try {
      const flat = await createResourceInStructure({
        courseId: input.courseId,
        name: input.name,
        parentId: input.parentId ?? null,
        typeKey: input.typeKey ?? null,
      })
      const action = new CreateAction(toTreeNode(flat), flat.parentId ?? ROOT_ID, flat.position)
      executeAction(get, set, action)
      set(structureFlatByIdAtom, (prev) => ({ ...prev, [flat.id]: flat }))
      info(`Ресурс создан: ${flat.id}`)

      return flat
    } catch (e) {
      logError(`Не удалось создать ресурс: ${e instanceof Error ? e.message : String(e)}`)
      throw e
    }
  },
)
