import { invoke } from '@mai/tauri/ipc'
import type { TaskSnapshotData } from '../core/model'

export function fetchTaskSnapshot(resourceId: string): Promise<TaskSnapshotData> {
  return invoke<TaskSnapshotData>('task_snapshot', { resourceId })
}
