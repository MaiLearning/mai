import { error as logError } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useState } from 'react'
import type { AnyTask } from '@/entities/task-plugin'
import { fetchTaskContent, saveTaskContent } from '@/entities/task-plugin/services'
import { notifyError, notifySuccess } from '@/utils/notifications'

export type TaskSaveState = 'idle' | 'saving' | 'saved' | 'error'

/**
 * Контент задач ресурса: загрузка при монтировании и смене ресурса,
 * явное сохранение набора. Логирование и уведомления — здесь, viewer
 * только отображает состояние.
 */
export function useTaskContent(resourceId: string) {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<AnyTask[]>([])
  const [saveState, setSaveState] = useState<TaskSaveState>('idle')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setTasks([])

    fetchTaskContent(resourceId)
      .then((data) => {
        if (!cancelled) setTasks(data.content.tasks)
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

  const save = useCallback(async () => {
    setSaveState('saving')
    try {
      await saveTaskContent({ resourceId, content: { tasks } })
      setSaveState('saved')
      notifySuccess('Сохранено', 'Набор задач обновлён')
    } catch (e) {
      logError(
        `Не удалось сохранить задачи ресурса ${resourceId}: ${e instanceof Error ? e.message : String(e)}`,
      )
      setSaveState('error')
      notifyError('Не удалось сохранить', 'Попробуйте ещё раз')
    }
  }, [resourceId, tasks])

  return { loading, tasks, setTasks, saveState, save }
}
