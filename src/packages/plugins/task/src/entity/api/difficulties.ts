import { invoke } from '@mai/tauri/ipc'
import type { CustomDifficulty } from '../core/model'

export function sendSetTaskDifficulties(
  resourceId: string,
  difficulties: CustomDifficulty[],
): Promise<void> {
  return invoke<void>('set_task_difficulties', { resourceId, difficulties })
}
