import { info, error as logError } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AnyTask,
  CustomDifficulty,
  TaskAnswer,
  TaskContent,
  TaskResult,
} from '@/entities/task-plugin'
import { fetchTaskContent, saveTaskContent } from '@/entities/task-plugin/services'
import { notifyError } from '@/utils/notifications'
import { backfillCompleted, withRestart, withResult, withTaskEdited } from './content'
import { useAutosave } from './useAutosave'

export type TaskSaveState = 'idle' | 'saving' | 'saved' | 'error'

const EMPTY_CONTENT: TaskContent = {
  tasks: [],
  difficulties: [],
  answers: {},
  results: {},
  completed: {},
}

/**
 * Контент задач ресурса: задачи, сложности, ответы и результаты прохождения.
 * Загрузка при монтировании и смене ресурса; любое изменение ставит отложенное
 * автосохранение всего контента. Логирование и уведомления — здесь.
 */
export function useTaskContent(resourceId: string) {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<TaskContent>(EMPTY_CONTENT)
  const contentRef = useRef(content)
  const { state: saveState, schedule } = useAutosave<TaskContent>(async (data) => {
    await saveTaskContent({ resourceId, content: data })
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setContent(EMPTY_CONTENT)
    contentRef.current = EMPTY_CONTENT

    fetchTaskContent(resourceId)
      .then((data) => {
        if (cancelled) return
        const next = backfillCompleted(data.content)
        contentRef.current = next
        setContent(next)
        info(`Задачи ресурса ${resourceId} загружены: ${data.content.tasks.length} шт.`)
      })
      .catch((e) => {
        logError(
          `Не удалось загрузить задачи ресурса ${resourceId}: ${e instanceof Error ? e.message : String(e)}`,
        )
        if (!cancelled) notifyError('Задачи не загрузились', 'Попробуйте открыть ресурс заново')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [resourceId])

  /** Единственная точка мутаций: обновляет ref и ставит отложенный сейв. */
  const applyChange = useCallback(
    (updater: (prev: TaskContent) => TaskContent) => {
      const next = updater(contentRef.current)
      if (next === contentRef.current) return
      contentRef.current = next
      setContent(next)
      schedule(next)
    },
    [schedule],
  )

  const setTasks = useCallback(
    (updater: (prev: AnyTask[]) => AnyTask[]) =>
      applyChange((prev) => ({ ...prev, tasks: updater(prev.tasks) })),
    [applyChange],
  )

  const setDifficulties = useCallback(
    (updater: (prev: CustomDifficulty[]) => CustomDifficulty[]) =>
      applyChange((prev) => ({ ...prev, difficulties: updater(prev.difficulties) })),
    [applyChange],
  )

  const setAnswer = useCallback(
    (taskId: string, answer: TaskAnswer) =>
      applyChange((prev) => ({ ...prev, answers: { ...prev.answers, [taskId]: answer } })),
    [applyChange],
  )

  /** Проверка: результат + факт прохождения (неважно, верно или нет). */
  const setResult = useCallback(
    (taskId: string, result: TaskResult) => {
      applyChange((prev) => withResult(prev, taskId, result))
      info(`Задача ${taskId} проверена: ${result === 'correct' ? 'верно' : 'есть ошибки'}`)
    },
    [applyChange],
  )

  /** Правка содержания задачи: ответ, результат и факт прохождения сбрасываются. */
  const editTask = useCallback(
    (taskId: string, next: AnyTask) => {
      applyChange((prev) => withTaskEdited(prev, taskId, next))
      info(`Содержание задачи ${taskId} изменено, прогресс прохождения сброшен`)
    },
    [applyChange],
  )

  /** «Пройти заново»: ответ и результат стираются; факт прохождения остаётся. */
  const restartTask = useCallback(
    (taskId: string) => {
      applyChange((prev) => withRestart(prev, taskId))
      info(`Задача ${taskId} запущена заново, ответ и результат сброшены`)
    },
    [applyChange],
  )

  return {
    loading,
    content,
    setTasks,
    setDifficulties,
    setAnswer,
    setResult,
    editTask,
    restartTask,
    saveState,
  }
}
