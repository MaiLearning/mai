import { usePluginSettings } from '@mai/plugin'
import { parseTheoryAutosaveDelay } from './autosaveDelay'

export function useEffectiveAutosaveDelay() {
  const pluginSettings = usePluginSettings('internal-theory')

  return parseTheoryAutosaveDelay(pluginSettings?.values.autosaveDelay)
}
