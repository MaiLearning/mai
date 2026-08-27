import { atom } from 'jotai'
import { createDirectory } from '../services/create'

/**
 * createDirectoryAtom — тонкая обёртка над сервисом создания директории.
 *
 * Сервис возвращает плоский узел структуры (StructureNodeFlat), поэтому в
 * directoriesAtom он не аппендится: список директорий пополняет только fetch,
 * а дерево сайдбара вставляет узел по собственному контракту.
 */
export const createDirectoryAtom = atom(
  null,
  async (_get, _set, input: { courseId: string; name: string; parentId?: string | null }) =>
    createDirectory({ ...input, parentId: input.parentId ?? null }),
)
