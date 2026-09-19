import { atom, type Getter, type Setter } from 'jotai'
import type { Tree } from '../tree'
import type { StructureAction } from './actions'
import { structureTreeAtom } from './atoms'

// ================================================================
//  История как jotai-атомы
// ================================================================

/**
 * История — цепочка Action для undo/redo, хранится в атомах, чтобы
 * canUndo/canRedo были реактивными (производные атомы ниже).
 *
 * Вместо двух стеков (past/future) используется один массив
 * и указатель (pointer) на текущее применённое действие.
 *
 * Схема:
 *   actions = [A1, A2, A3, A4]
 *   pointer = 2  (применены A1..A3)
 *
 *   canUndo = pointer >= 0              → A3 можно отменить
 *   canRedo = pointer < actions.length-1 → A4 можно повторить
 *
 * При execute нового действия всё, что было после pointer,
 * отбрасывается (actions.length = pointer + 1). Это стандартное
 * поведение undo/redo: новое действие = новая ветка, future сбрасывается.
 */
const historyActionsAtom = atom<StructureAction[]>([])
const historyPointerAtom = atom(-1)

/** Есть ли действие, которое можно отменить. */
export const canUndoAtom = atom((get) => get(historyPointerAtom) >= 0)

/** Есть ли отменённое действие, которое можно повторить. */
export const canRedoAtom = atom(
  (get) => get(historyPointerAtom) < get(historyActionsAtom).length - 1,
)

// ================================================================
//  Операции над историей (для action-атомов сущности)
// ================================================================

/**
 * execute — применить новое действие и добавить в историю.
 *
 * 1. Обрезает future (всё после pointer)
 * 2. Добавляет action в конец и двигает pointer
 * 3. Применяет action.do() к дереву (оптимистично)
 *
 * Если sendDo упадёт — вызывающий атом вызовет revertAction().
 */
export function executeAction(get: Getter, set: Setter, action: StructureAction): Tree {
  const pointer = get(historyPointerAtom)
  const actions = [...get(historyActionsAtom).slice(0, pointer + 1), action]
  set(historyActionsAtom, actions)
  set(historyPointerAtom, actions.length - 1)
  const next = action.do(get(structureTreeAtom))
  set(structureTreeAtom, next)

  return next
}

/**
 * revert — откат последнего действия (при ошибке sendDo).
 *
 * 1. Применяет action.undo() к дереву
 * 2. Удаляет action из цепочки (обрезка до pointer)
 *
 * После revert указатель возвращается на предыдущее действие,
 * а упавший action исчезает из истории.
 */
export function revertAction(get: Getter, set: Setter): void {
  const actions = get(historyActionsAtom)
  const pointer = get(historyPointerAtom)
  if (pointer < 0) return
  set(structureTreeAtom, actions[pointer].undo(get(structureTreeAtom)))
  set(historyActionsAtom, actions.slice(0, pointer))
  set(historyPointerAtom, pointer - 1)
}

function getUndoAction(get: Getter): StructureAction | null {
  const pointer = get(historyPointerAtom)

  return pointer >= 0 ? get(historyActionsAtom)[pointer] : null
}

function getRedoAction(get: Getter): StructureAction | null {
  const actions = get(historyActionsAtom)
  const pointer = get(historyPointerAtom)

  return pointer < actions.length - 1 ? actions[pointer + 1] : null
}

/**
 * commitUndo — применить отмену к дереву и сдвинуть pointer назад.
 * Вызывается ПОСЛЕ успешного sendUndo на backend.
 */
function commitUndo(get: Getter, set: Setter): void {
  const action = getUndoAction(get)
  if (!action) return
  set(structureTreeAtom, action.undo(get(structureTreeAtom)))
  set(historyPointerAtom, get(historyPointerAtom) - 1)
}

/**
 * commitRedo — применить повтор к дереву и сдвинуть pointer вперёд.
 * Вызывается ПОСЛЕ успешного sendDo на backend.
 */
function commitRedo(get: Getter, set: Setter): void {
  const actions = get(historyActionsAtom)
  const pointer = get(historyPointerAtom)
  if (pointer >= actions.length - 1) return
  set(historyPointerAtom, pointer + 1)
  set(structureTreeAtom, actions[pointer + 1].do(get(structureTreeAtom)))
}

/** clear — сбросить историю (вызывается при загрузке структуры курса). */
export function clearHistory(set: Setter): void {
  set(historyActionsAtom, [])
  set(historyPointerAtom, -1)
}

// ================================================================
//  Undo / Redo атомы (backend-first)
// ================================================================

/**
 * undoStructureAtom — отменить последнее действие.
 *
 * Backend-first: сначала sendUndo, потом commitUndo.
 * Если backend упал — дерево не трогаем, выбрасываем ошибку.
 * Потребитель (хук/компонент) ловит ошибку и показывает уведомление.
 */
export const undoStructureAtom = atom(null, async (get, set) => {
  const action = getUndoAction(get)
  if (!action) return

  try {
    await action.sendUndo()
  } catch (e) {
    throw new Error(
      `Не удалось отменить действие на сервере: ${e instanceof Error ? e.message : String(e)}`,
    )
  }

  commitUndo(get, set)
})

/**
 * redoStructureAtom — повторить отменённое действие.
 *
 * Аналогично undo: backend-first → commitRedo.
 */
export const redoStructureAtom = atom(null, async (get, set) => {
  const action = getRedoAction(get)
  if (!action) return

  try {
    await action.sendDo()
  } catch (e) {
    throw new Error(
      `Не удалось повторить действие на сервере: ${e instanceof Error ? e.message : String(e)}`,
    )
  }

  commitRedo(get, set)
})
