import { invoke } from '@tauri-apps/api/core'
import type { TaskContentData } from '../core/model'

export function fetchTaskContent(resourceId: string): Promise<TaskContentData> {
  return invoke<TaskContentData>('get_task_content', { resourceId })
}
