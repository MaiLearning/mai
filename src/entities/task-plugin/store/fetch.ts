import { atom } from 'jotai'
import { fetchTaskSnapshot } from '../services/snapshot'
import { taskSnapshotsAtom } from './atoms'

export const loadTaskSnapshotAtom = atom(null, async (_get, set, resourceId: string) => {
  const snapshot = await fetchTaskSnapshot(resourceId)
  set(taskSnapshotsAtom, (prev) => ({ ...prev, [resourceId]: snapshot }))
})
