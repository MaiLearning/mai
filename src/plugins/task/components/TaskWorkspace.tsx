import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import type { CustomDifficulty } from '@/entities/task-plugin'
import { TaskRenderer } from '../core/registry'
import type { AnyTask, CheckStatus, TaskKind, ViewMode } from '../core/types'
import { createTask } from '../lib/task-factory'
import type { TaskSaveState } from '../lib/useTaskContent'
import { Body, BodyInner, Viewer } from '../viewer.style'
import { WorkspaceFooter } from './WorkspaceFooter'
import { WorkspaceHeader } from './WorkspaceHeader'

interface TaskWorkspaceProps {
  tasks: AnyTask[]
  difficulties: CustomDifficulty[]
  setTasks: Dispatch<SetStateAction<AnyTask[]>>
  setDifficulties: Dispatch<SetStateAction<CustomDifficulty[]>>
  initialMode: ViewMode
  saveState: TaskSaveState
  onSave: () => void
}

/**
 * Оболочка работы с набором задач: степ-полоса (навигация + создание),
 * метаданные с редактором сложности, режимы «Прохождение/Редактор» и футер.
 * Проверка ответов — визуальная заглушка, механизм проверки вне зоны дизайна.
 */
export function TaskWorkspace({
  tasks,
  difficulties,
  setTasks,
  setDifficulties,
  initialMode,
  saveState,
  onSave,
}: TaskWorkspaceProps) {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<ViewMode>(initialMode)
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>({})

  const task = tasks[index]
  const status = statuses[task.id] ?? 'idle'
  const editing = mode === 'edit'

  const stepState = (i: number): 'idle' | 'current' | 'correct' | 'incorrect' => {
    if (i === index) return 'current'

    const s = statuses[tasks[i].id]
    if (s === 'correct') return 'correct'
    if (s === 'incorrect') return 'incorrect'

    return 'idle'
  }

  const updateTask = (id: string, patch: Partial<AnyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? ({ ...t, ...patch } as AnyTask) : t)))
  }

  const addTask = (kind: TaskKind) => {
    setTasks((prev) => [...prev, createTask(kind)])
    setIndex(tasks.length)
    setMode('edit')
  }

  const check = () => {
    setStatuses((prev) => ({ ...prev, [task.id]: 'correct' }))
  }

  const go = (dir: -1 | 1) => {
    setIndex((i) => Math.min(tasks.length - 1, Math.max(0, i + dir)))
  }

  return (
    <Viewer aria-label="Просмотр задач">
      <WorkspaceHeader
        tasks={tasks}
        index={index}
        task={task}
        mode={mode}
        difficulties={difficulties}
        stepState={stepState}
        onSelect={setIndex}
        onSetMode={setMode}
        onUpdateTask={updateTask}
        onSetDifficulties={setDifficulties}
        onCreate={addTask}
      />

      <Body className="app-scroll">
        <BodyInner>
          <TaskRenderer
            task={task}
            mode={mode}
            status={editing ? 'idle' : status}
            onChange={(next) => updateTask(task.id, next)}
          />
        </BodyInner>
      </Body>

      <WorkspaceFooter
        index={index}
        count={tasks.length}
        editing={editing}
        status={status}
        saveState={saveState}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onCheck={check}
        onSave={onSave}
      />
    </Viewer>
  )
}
