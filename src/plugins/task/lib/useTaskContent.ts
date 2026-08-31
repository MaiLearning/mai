import { info, error as logError } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TaskContent } from '@/entities/task-plugin'
import { fetchTaskSnapshot } from '@/entities/task-plugin/services'
import { notifyError } from '@/utils/notifications'
import { useSavePipeline } from './useSavePipeline'
import { useTaskMutations } from './useTaskMutations'

const EMPTY_CONTENT: TaskContent = {
  tasks: [],
  difficulties: [],
  answers: {},
  results: {},
  completed: {},
}

/**
 * Контент задач ресурса: задачи, сложности, ответы и результаты прохождения.
 * Загрузка снапшота при монтировании и смене ресурса; операции мутаций —
 * в useTaskMutations. Логирование и уведомления — здесь.
 */
export function useTaskContent(resourceId: string) {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<TaskContent>(EMPTY_CONTENT)
  const contentRef = useRef(content)
  const { state: saveState, enqueue } = useSavePipeline()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setContent(EMPTY_CONTENT)
    contentRef.current = EMPTY_CONTENT

    fetchTaskSnapshot(resourceId)
      .then((snapshot) => {
        if (cancelled) return
        contentRef.current = snapshot.content
        setContent(snapshot.content)
        info(`Задачи ресурса ${resourceId} загружены: ${snapshot.content.tasks.length} шт.`)
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

  /** Оптимистичный апдейт локального зеркала контента. */
  const applyLocal = useCallback((updater: (prev: TaskContent) => TaskContent) => {
    const next = updater(contentRef.current)
    if (next === contentRef.current) return
    contentRef.current = next
    setContent(next)
  }, [])

  const mutations = useTaskMutations(resourceId, applyLocal, () => contentRef.current, enqueue)

  return { loading, content, saveState, ...mutations }
}
