import { info } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import { fetchStructure } from '../services'
import { Tree } from '../tree'
import { structureFlatByIdAtom, structureTreeAtom, toTreeNode } from './atoms'
import { clearHistory } from './history'

/**
 * loadStructureAtom — первичная загрузка структуры курса.
 *
 * 1. fetchStructure(courseId) — через entity-сервис
 * 2. Заполняет payload-карту и собирает дерево (SSOT)
 * 3. Очищает историю undo/redo
 *
 * Вызывается при монтировании sidebar-а и смене courseId.
 */
export const loadStructureAtom = atom(null, async (_get, set, courseId: string) => {
  const flat = await fetchStructure(courseId)
  set(structureFlatByIdAtom, Object.fromEntries(flat.map((node) => [node.id, node])))
  set(structureTreeAtom, Tree.from(flat.map(toTreeNode)))
  clearHistory(set)
  info(`Структура курса загружена: ${courseId} (${flat.length} узлов)`)
})
