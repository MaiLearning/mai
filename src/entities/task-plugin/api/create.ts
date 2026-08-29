import { invoke } from '@tauri-apps/api/core'
import type { TaskContent, TaskContentData } from '../core/model'

export function sendSaveTaskContent(
  resourceId: string,
  content: TaskContent,
): Promise<TaskContentData> {
  return invoke<TaskContentData>('save_task_content', { resourceId, content })
}
