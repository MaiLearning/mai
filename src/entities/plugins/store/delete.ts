import { atom } from 'jotai'
import { removePlugin } from '../services/delete'
import { pluginsAtom } from './atoms'

export const removePluginAtom = atom(null, async (_get, set, id: string) => {
  await removePlugin(id)
  set(pluginsAtom, (prev) => prev.filter((p) => p.id !== id))
})
