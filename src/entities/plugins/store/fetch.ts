import { atom } from 'jotai'
import { fetchPlugins } from '../services/fetch'
import { pluginsAtom } from './atoms'

export const loadPluginsAtom = atom(null, async (_get, set) => {
  const plugins = await fetchPlugins()
  set(pluginsAtom, plugins)
})
