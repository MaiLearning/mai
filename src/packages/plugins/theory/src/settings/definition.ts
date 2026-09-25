import { definePluginSettings } from '@mai/settings'
import { z } from 'zod'

export const theorySettingsDefinition = definePluginSettings({
  nameKey: 'settings.name',
  i18nNamespace: 'theory',
  schema: z.object({
    autosaveDelay: z.enum(['500', '1000', '2000']).default('500').meta({
      title: 'settings.autosaveDelay.label',
      description: 'settings.autosaveDelay.hint',
    }),
  }),
})
