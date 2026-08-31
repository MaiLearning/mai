import { invoke } from '@tauri-apps/api/core'
import type { TaskAnswer, TaskAttempt, TaskResult } from '../core/model'

export function sendSubmitTaskAnswer(taskId: string, answer: TaskAnswer): Promise<void> {
  return invoke<void>('submit_task_answer', { taskId, answer })
}

export function sendSetTaskResult(
  taskId: string,
  answer: TaskAnswer | null,
  result: TaskResult,
): Promise<void> {
  return invoke<void>('set_task_result', { taskId, answer, result })
}

export function sendRestartTask(taskId: string): Promise<void> {
  return invoke<void>('restart_task', { taskId })
}

export function sendListTaskAttempts(taskId: string): Promise<TaskAttempt[]> {
  return invoke<TaskAttempt[]>('list_task_attempts', { taskId })
}
