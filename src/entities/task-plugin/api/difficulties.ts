import { invoke } from '@tauri-apps/api/core'
import type { CustomDifficulty } from '../core/model'

export function sendSetTaskDifficulties(
  resourceId: string,
  difficulties: CustomDifficulty[],
): Promise<void> {
  return invoke<void>('set_task_difficulties', { resourceId, difficulties })
}
