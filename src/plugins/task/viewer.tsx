import { Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Spinner } from '@/app/theme/components/Spinner'
import type { PluginRenderProps } from '@/features/plugin/core/types'
import { TaskWorkspace } from './components/TaskWorkspace'
import { createTask } from './lib/task-factory'
import { useTaskContent } from './lib/useTaskContent'
import { EmptyState, EmptyText, GhostButton, SpinnerWrap, Viewer } from './viewer.style'

/**
 * TaskViewer — viewer плагина task: тянет контент ресурса через сущность
 * `task-plugin`, пустой набор предлагает создать первую задачу.
 */
export function TaskViewer({ resourceId, onReady }: PluginRenderProps) {
  const { loading, tasks, difficulties, setTasks, setDifficulties, saveState, save } =
    useTaskContent(resourceId)

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    if (!loading) onReadyRef.current?.()
  }, [loading])

  if (loading) {
    return (
      <Viewer>
        <SpinnerWrap>
          <Spinner label="Загрузка задач" />
        </SpinnerWrap>
      </Viewer>
    )
  }

  if (tasks.length === 0) {
    return (
      <Viewer>
        <EmptyState>
          <EmptyText>В этом наборе пока нет задач</EmptyText>
          <GhostButton type="button" onClick={() => setTasks([createTask('SingleChoice')])}>
            <Plus size={16} /> Добавить задачу
          </GhostButton>
        </EmptyState>
      </Viewer>
    )
  }

  return (
    <TaskWorkspace
      key={resourceId}
      tasks={tasks}
      difficulties={difficulties}
      setTasks={setTasks}
      setDifficulties={setDifficulties}
      initialMode={tasks.length === 1 && tasks[0].prompt === '' ? 'edit' : 'solve'}
      saveState={saveState}
      onSave={() => void save()}
    />
  )
}
