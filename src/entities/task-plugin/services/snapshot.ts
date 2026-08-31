import { fetchTaskSnapshot as invokeSnapshot } from '../api/snapshot'
import type { TaskSnapshotData } from '../core/model'
import { TaskSnapshotDataSchema } from '../core/schema'

export async function fetchTaskSnapshot(resourceId: string): Promise<TaskSnapshotData> {
  const data = await invokeSnapshot(resourceId)

  return TaskSnapshotDataSchema.parse(data)
}
