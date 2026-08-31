import { info } from '@tauri-apps/plugin-log'
import { useCallback } from 'react'
import type {
  AnyTask,
  CustomDifficulty,
  Difficulty,
  TaskAnswer,
  TaskContent,
  TaskKind,
  TaskResult,
} from '@/entities/task-plugin'
import {
  createTask as createTaskEntity,
  deleteTask as deleteTaskEntity,
  restartTask as restartTaskEntity,
  setTaskDifficulties as setTaskDifficultiesEntity,
  setTaskResult,
  submitTaskAnswer,
  updateTaskContent as updateTaskContentEntity,
  updateTaskDifficulty as updateTaskDifficultyEntity,
} from '@/entities/task-plugin/services'
import { withRestart, withResult, withTaskDeleted, withTaskEdited } from './content'
import type { SaveOp } from './save-pipeline'

type ApplyLocal = (updater: (prev: TaskContent) => TaskContent) => void
type GetContent = () => TaskContent

/**
 * Операции над задачами ресурса: каждая оптимистично меняет локальное
 * зеркало и отправляет гранулярную команду через конвейер сохранения.
 */
export function useTaskMutations(
  resourceId: string,
  applyLocal: ApplyLocal,
  getContent: GetContent,
  enqueue: (op: SaveOp) => void,
) {
  /**
   * Создание задачи: id и дефолты генерирует backend — оптимистичного id нет.
   * onCreated вызывается сразу после добавления задачи в локальное зеркало —
   * UI фокусируется на ней по факту появления, а не синхронно.
   */
  const addTask = useCallback(
    (kind: TaskKind, onCreated?: (task: AnyTask) => void) => {
      enqueue({
        run: async () => {
          const task = await createTaskEntity({ resourceId, kind })
          applyLocal((prev) => ({ ...prev, tasks: [...prev.tasks, task] }))
          info(`Создана задача ${task.id}: ${kind}`)
          onCreated?.(task)
        },
      })
    },
    [enqueue, resourceId, applyLocal],
  )

  /** Удаление задачи — вместе с её ответом, результатом и флагом прохождения. */
  const deleteTask = useCallback(
    (taskId: string) => {
      applyLocal((prev) => withTaskDeleted(prev, taskId))
      enqueue({ run: () => deleteTaskEntity({ taskId }) })
    },
    [enqueue, applyLocal],
  )

  /** Правка содержания задачи: ответ, результат и факт прохождения сбрасываются. */
  const updateTaskContent = useCallback(
    (taskId: string, next: AnyTask) => {
      applyLocal((prev) => withTaskEdited(prev, taskId, next))
      info(`Содержание задачи ${taskId} изменено, прогресс прохождения сброшен`)
      enqueue({
        coalesceKey: `content:${taskId}`,
        run: () => updateTaskContentEntity({ taskId, task: next }),
      })
    },
    [enqueue, applyLocal],
  )

  /** Правка только сложности: метаданные, прогресс не трогается. */
  const updateTaskDifficulty = useCallback(
    (taskId: string, difficulty: Difficulty) => {
      applyLocal((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, difficulty } : task)),
      }))
      enqueue({
        coalesceKey: `difficulty:${taskId}`,
        run: () => updateTaskDifficultyEntity({ taskId, difficulty }),
      })
    },
    [enqueue, applyLocal],
  )

  /** Полная замена набора своих сложностей ресурса. */
  const setTaskDifficulties = useCallback(
    (next: CustomDifficulty[]) => {
      applyLocal((prev) => ({ ...prev, difficulties: next }))
      enqueue({
        coalesceKey: 'difficulties',
        run: () => setTaskDifficultiesEntity({ resourceId, difficulties: next }),
      })
    },
    [enqueue, resourceId, applyLocal],
  )

  const setAnswer = useCallback(
    (taskId: string, answer: TaskAnswer) => {
      applyLocal((prev) => ({ ...prev, answers: { ...prev.answers, [taskId]: answer } }))
      enqueue({
        coalesceKey: `answer:${taskId}`,
        run: () => submitTaskAnswer({ taskId, answer }),
      })
    },
    [enqueue, applyLocal],
  )

  /** Проверка: результат + факт прохождения; ответ несётся с собой — снапшот попытки точен. */
  const setResult = useCallback(
    (taskId: string, result: TaskResult) => {
      applyLocal((prev) => withResult(prev, taskId, result))
      const answer = getContent().answers[taskId] ?? null
      info(`Задача ${taskId} проверена: ${result === 'correct' ? 'верно' : 'есть ошибки'}`)
      enqueue({ run: () => setTaskResult({ taskId, answer, result }) })
    },
    [enqueue, applyLocal, getContent],
  )

  /** «Пройти заново»: ответ и результат стираются; факт прохождения остаётся. */
  const restartTask = useCallback(
    (taskId: string) => {
      applyLocal((prev) => withRestart(prev, taskId))
      info(`Задача ${taskId} запущена заново, ответ и результат сброшены`)
      enqueue({ run: () => restartTaskEntity({ taskId }) })
    },
    [enqueue, applyLocal],
  )

  return {
    addTask,
    deleteTask,
    updateTaskContent,
    updateTaskDifficulty,
    setTaskDifficulties,
    setAnswer,
    setResult,
    restartTask,
  }
}
