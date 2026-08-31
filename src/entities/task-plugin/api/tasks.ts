import { invoke } from '@tauri-apps/api/core'
import type { AnyTask, Difficulty, TaskKind } from '../core/model'

export function sendCreateTask(resourceId: string, kind: TaskKind): Promise<AnyTask> {
  return invoke<AnyTask>('create_task', { resourceId, kind })
}

export function sendUpdateTaskContent(taskId: string, task: AnyTask): Promise<void> {
  return invoke<void>('update_task_content', { taskId, task })
}

export function sendUpdateTaskDifficulty(taskId: string, difficulty: Difficulty): Promise<void> {
  return invoke<void>('update_task_difficulty', { taskId, difficulty })
}

export function sendDeleteTask(taskId: string): Promise<void> {
  return invoke<void>('delete_task', { taskId })
}
