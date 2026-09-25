import { definePluginSettings } from '@mai/settings'
import { getDefaultStore } from 'jotai'
import { beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  getInternalPluginSettings,
  type PluginSettingsDefinition,
  pluginSettingsDefinitionsAtom,
  setInternalPluginSettings,
} from './registry'

const definition = definePluginSettings({
  i18nNamespace: 'plugin',
  schema: z.object({ enabled: z.boolean().default(true) }),
}) satisfies PluginSettingsDefinition

const nextDefinition = definePluginSettings({
  i18nNamespace: 'next-plugin',
  schema: z.object({ count: z.string().default('0') }),
}) satisfies PluginSettingsDefinition

const store = getDefaultStore()

beforeEach(() => {
  setInternalPluginSettings({})
})

describe('plugin settings registry', () => {
  it('replaces definitions and reads them by plugin ID', () => {
    setInternalPluginSettings({ theory: definition })

    expect(getInternalPluginSettings('theory')).toEqual(definition)
    expect(store.get(pluginSettingsDefinitionsAtom)).toEqual([{ pluginId: 'theory', definition }])

    setInternalPluginSettings({ task: nextDefinition })

    expect(getInternalPluginSettings('theory')).toBeUndefined()
    expect(getInternalPluginSettings('task')).toEqual(nextDefinition)
    expect(store.get(pluginSettingsDefinitionsAtom)).toEqual([
      { pluginId: 'task', definition: nextDefinition },
    ])
  })
})
