import { type UseSettingsValuesResult, useSettingsValues } from '@mai/settings'
import { useAtomValue } from 'jotai'
import { emptyPluginSettingsDefinition, pluginSettingsDefinitionsAtom } from './registry'

export function usePluginSettings(pluginId: string): UseSettingsValuesResult | null {
  const registrations = useAtomValue(pluginSettingsDefinitionsAtom)
  const definition = registrations.find(
    (registration) => registration.pluginId === pluginId,
  )?.definition
  const result = useSettingsValues(
    definition ?? emptyPluginSettingsDefinition,
    'plugin',
    pluginId,
    definition !== undefined,
  )

  return definition === undefined ? null : result
}
