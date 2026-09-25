import { EMPTY_SETTINGS_DEFINITION, type SettingsDefinition } from '@mai/settings'
import { atom, getDefaultStore } from 'jotai'

export type PluginSettingsDefinition = SettingsDefinition

export type PluginSettingsRegistration = {
  pluginId: string
  definition: PluginSettingsDefinition
}

export const pluginSettingsDefinitionsAtom = atom<PluginSettingsRegistration[]>([])

const store = getDefaultStore()

export function setInternalPluginSettings(
  definitions: Record<string, PluginSettingsDefinition>,
): void {
  const registrations = Object.entries(definitions).map(([pluginId, definition]) => ({
    pluginId,
    definition,
  }))

  store.set(pluginSettingsDefinitionsAtom, registrations)
}

export function getInternalPluginSettings(pluginId: string): PluginSettingsDefinition | undefined {
  return store
    .get(pluginSettingsDefinitionsAtom)
    .find((registration) => registration.pluginId === pluginId)?.definition
}

export const emptyPluginSettingsDefinition = EMPTY_SETTINGS_DEFINITION
