import { atom } from 'jotai'
import { fetchCodeContentSnapshot } from '../services/snapshot'
import { codeSnapshotsAtom } from './atoms'

export const loadCodeSnapshotAtom = atom(null, async (_get, set, resourceId: string) => {
  const snapshot = await fetchCodeContentSnapshot(resourceId)
  set(codeSnapshotsAtom, (prev) => ({ ...prev, [resourceId]: snapshot }))
})
