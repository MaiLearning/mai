import { atom } from 'jotai'
import { setPluginEnabled } from '../services/update'
import { pluginsAtom } from './atoms'

export const setPluginEnabledAtom = atom(
  null,
  async (_get, set, input: { id: string; enabled: boolean }) => {
    const updated = await setPluginEnabled(input.id, input.enabled)
    set(pluginsAtom, (prev) => prev.map((p) => (p.id === updated.id ? updated : p)))

    return updated
  },
)
