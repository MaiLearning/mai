import { atom } from 'jotai'
import type { RegisterPluginInput } from '../core/model'
import { registerInternalPlugin, registerPlugin } from '../services/create'
import { pluginsAtom } from './atoms'

export const registerPluginAtom = atom(null, async (_get, set, input: RegisterPluginInput) => {
  const plugin = await registerPlugin(input)
  set(pluginsAtom, (prev) => [...prev, plugin])
  return plugin
})

export const registerInternalPluginAtom = atom(
  null,
  async (
    _get,
    set,
    input: {
      id: string
      name: string
      version: string
      description?: string | null
      author?: string | null
    },
  ) => {
    const plugin = await registerInternalPlugin({
      ...input,
      description: input.description ?? null,
      author: input.author ?? null,
    })
    set(pluginsAtom, (prev) => [...prev, plugin])
    return plugin
  },
)
