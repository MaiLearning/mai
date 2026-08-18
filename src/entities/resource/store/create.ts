import { atom } from 'jotai'
import { createResourceType } from '../services/create'
import { resourceTypesAtom } from './atoms'

export const createResourceTypeAtom = atom(
  null,
  async (
    _get,
    set,
    input: {
      key: string
      name: string
      description?: string | null
      pluginId?: string | null
      supportedExtensions: string[]
    },
  ) => {
    const type = await createResourceType({
      ...input,
      description: input.description ?? null,
      pluginId: input.pluginId ?? null,
    })
    set(resourceTypesAtom, (prev) => [...prev, type])
    return type
  },
)
