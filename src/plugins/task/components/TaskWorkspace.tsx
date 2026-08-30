import { useState } from 'react'
import type { CustomDifficulty, TaskAnswer, TaskResult } from '@/entities/task-plugin'
import { TaskRenderer } from '../core/registry'
import type { AnyTask, TaskKind, ViewMode } from '../core/types'
import { checkTask } from '../lib/check'
import { createTask } from '../lib/task-factory'
import type { TaskSaveState } from '../lib/useTaskContent'
import { Body, BodyInner, Viewer } from '../viewer.style'
import { WorkspaceFooter } from './WorkspaceFooter'
import { WorkspaceHeader } from './WorkspaceHeader'

interface TaskWorkspaceProps {
  tasks: AnyTask[]
  difficulties: CustomDifficulty[]
  answers: Record<string, TaskAnswer>
  results: Record<string, TaskResult>
  setTasks: (updater: (prev: AnyTask[]) => AnyTask[]) => void
  setDifficulties: (updater: (prev: CustomDifficulty[]) => CustomDifficulty[]) => void
  setAnswer: (taskId: string, answer: TaskAnswer) => void
  setResult: (taskId: string, result: TaskResult) => void
  editTask: (taskId: string, next: AnyTask) => void
  restartTask: (taskId: string) => void
  initialMode: ViewMode
  saveState: TaskSaveState
}

/**
 * Оболочка работы с набором задач: степ-полоса (навигация + создание),
 * метаданные с редактором сложности, режимы «Прохождение/Редактор» и футер.
 * Ответы и результаты живут в контенте ресурса, автосохранение — в useTaskContent.
 */
export function TaskWorkspace({
  tasks,
  difficulties,
  answers,
  results,
  setTasks,
  setDifficulties,
  setAnswer,
  setResult,
  editTask,
  restartTask,
  initialMode,
  saveState,
}: TaskWorkspaceProps) {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<ViewMode>(initialMode)

  const task = tasks[index]
  const status = results[task.id] ?? 'idle'
  const editing = mode === 'edit'

  const stepState = (i: number): 'idle' | 'current' | 'correct' | 'incorrect' => {
    if (i === index) return 'current'

    const s = results[tasks[i].id]
    if (s === 'correct') return 'correct'
    if (s === 'incorrect') return 'incorrect'

    return 'idle'
  }

  /** Правка сложности — метаданные; правка содержания сбрасывает прогресс задачи. */
  const updateTask = (id: string, patch: Partial<AnyTask>) => {
    const current = tasks.find((t) => t.id === id)
    if (!current) return

    const next = { ...current, ...patch } as AnyTask
    const metadataOnly = Object.keys(patch).length === 1 && 'difficulty' in patch
    if (metadataOnly) setTasks((prev) => prev.map((t) => (t.id === id ? next : t)))
    else editTask(id, next)
  }

  const addTask = (kind: TaskKind) => {
    setTasks((prev) => [...prev, createTask(kind)])
    setIndex(tasks.length)
    setMode('edit')
  }

  /** Проверка по типу задачи; повторная проверка — через «Пройти заново». */
  const check = () => {
    setResult(task.id, checkTask(task, answers[task.id]))
  }

  /** Перезапуск прохождения: ответ и результат стираются. */
  const restart = () => restartTask(task.id)

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
        onSetDifficulties={(next) => setDifficulties(() => next)}
        onCreate={addTask}
      />

      <Body className="app-scroll">
        <BodyInner>
          <TaskRenderer
            task={task}
            mode={mode}
            status={editing ? 'idle' : status}
            onChange={(next) => updateTask(task.id, next)}
            answer={answers[task.id]}
            onAnswer={(answer) => setAnswer(task.id, answer)}
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
        onRestart={restart}
      />
    </Viewer>
  )
}
