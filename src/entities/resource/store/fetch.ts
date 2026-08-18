import { atom } from 'jotai'
import { fetchResourceTypes } from '../services/fetch'
import { resourceTypesAtom } from './atoms'

export const loadResourceTypesAtom = atom(null, async (_get, set) => {
  const types = await fetchResourceTypes()
  set(resourceTypesAtom, types)
})
