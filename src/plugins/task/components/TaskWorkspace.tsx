import { info } from '@tauri-apps/plugin-log'
import { useEffect, useState } from 'react'
import type { CustomDifficulty, TaskAnswer, TaskResult } from '@/entities/task-plugin'
import { TaskRenderer } from '../core/registry'
import type { AnyTask, Difficulty, TaskKind, ViewMode } from '../core/types'
import { checkTask } from '../lib/check'
import type { SaveState } from '../lib/useSavePipeline'
import { Body, BodyInner, Viewer } from '../viewer.style'
import { WorkspaceFooter } from './WorkspaceFooter'
import { WorkspaceHeader } from './WorkspaceHeader'

interface TaskWorkspaceProps {
  tasks: AnyTask[]
  difficulties: CustomDifficulty[]
  answers: Record<string, TaskAnswer>
  results: Record<string, TaskResult>
  addTask: (kind: TaskKind, onCreated?: (task: AnyTask) => void) => void
  deleteTask: (taskId: string) => void
  updateTaskContent: (taskId: string, next: AnyTask) => void
  updateTaskDifficulty: (taskId: string, difficulty: Difficulty) => void
  setTaskDifficulties: (next: CustomDifficulty[]) => void
  setAnswer: (taskId: string, answer: TaskAnswer) => void
  setResult: (taskId: string, result: TaskResult) => void
  restartTask: (taskId: string) => void
  initialMode: ViewMode
  saveState: SaveState
}

/**
 * Оболочка работы с набором задач: степ-полоса (навигация + создание),
 * метаданные с редактором сложности, режимы «Прохождение/Редактор» и футер.
 * Ответы и результаты живут в контенте ресурса, сохранение — в useTaskContent.
 */
export function TaskWorkspace({
  tasks,
  difficulties,
  answers,
  results,
  addTask,
  deleteTask,
  updateTaskContent,
  updateTaskDifficulty,
  setTaskDifficulties,
  setAnswer,
  setResult,
  restartTask,
  initialMode,
  saveState,
}: TaskWorkspaceProps) {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<ViewMode>(initialMode)
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null)

  /** Страховка границ: индекс не выходит за пределы набора (гонки создания/удаления). */
  useEffect(() => {
    setIndex((prev) => Math.min(prev, tasks.length - 1))
  }, [tasks.length])

  /** Фокус на созданной задаче — по факту её появления в наборе, не синхронно. */
  useEffect(() => {
    if (pendingFocusId === null) return
    const i = tasks.findIndex((t) => t.id === pendingFocusId)
    if (i < 0) return

    setIndex(i)
    setMode('edit')
    setPendingFocusId(null)
  }, [pendingFocusId, tasks])

  const task = tasks[index]
  if (!task) {
    // Clamp-effect держит индекс в границах; guard — крайняя защита от рассинхрона.
    return (
      <Viewer aria-label="Просмотр задач">
        <Body className="app-scroll">
          <BodyInner />
        </Body>
      </Viewer>
    )
  }

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
    if (metadataOnly) {
      updateTaskDifficulty(id, next.difficulty)
      info(`Сложность задачи ${id} изменена`)
    } else updateTaskContent(id, next)
  }

  /** Создание: задача придёт от backend, фокус и режим редактора — после её появления. */
  const create = (kind: TaskKind) => {
    addTask(kind, (created) => setPendingFocusId(created.id))
  }

  /** Удаление: индекс схлопывается, чтобы не выйти за границы набора. */
  const remove = (taskId: string) => {
    const i = tasks.findIndex((t) => t.id === taskId)
    deleteTask(taskId)
    if (i < 0) return
    setIndex((prev) => {
      const shifted = prev > i ? prev - 1 : prev

      return Math.max(0, Math.min(shifted, tasks.length - 2))
    })
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
        onSetDifficulties={setTaskDifficulties}
        onDelete={remove}
        onCreate={create}
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
