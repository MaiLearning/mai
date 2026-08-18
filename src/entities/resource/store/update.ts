import { atom } from 'jotai'
import { updateResource } from '../services/update'
import { resourcesAtom } from './atoms'

export const updateResourceAtom = atom(
  null,
  async (
    _get,
    set,
    input: { resourceId: string; courseId: string; name: string; typeKey: string | null },
  ) => {
    const updated = await updateResource(input)
    set(resourcesAtom, (prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    return updated
  },
)
