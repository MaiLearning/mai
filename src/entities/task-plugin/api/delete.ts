import { invoke } from '@tauri-apps/api/core'
import type { TaskContentData } from '../core/model'

export function sendClearTaskContent(resourceId: string): Promise<TaskContentData> {
  return invoke<TaskContentData>('clear_task_content', { resourceId })
}

export function sendDeleteTaskContent(resourceId: string): Promise<TaskContentData> {
  return invoke<TaskContentData>('delete_task_content', { resourceId })
}
