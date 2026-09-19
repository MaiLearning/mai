import { atom } from 'jotai'
import type { SetTaskDifficultiesInput } from '../core/model'
import { setTaskDifficulties } from '../services/difficulties'
import { taskSnapshotsAtom } from './atoms'

/** Полная замена набора своих сложностей ресурса. */
export const setTaskDifficultiesAtom = atom(
  null,
  async (_get, set, input: SetTaskDifficultiesInput) => {
    await setTaskDifficulties(input)
    set(taskSnapshotsAtom, (prev) => {
      const snapshot = prev[input.resourceId]
      if (!snapshot) return prev

      return {
        ...prev,
        [input.resourceId]: {
          ...snapshot,
          content: { ...snapshot.content, difficulties: input.difficulties },
        },
      }
    })
  },
)
