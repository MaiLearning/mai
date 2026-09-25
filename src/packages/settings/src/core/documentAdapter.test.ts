import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { definePluginSettings } from './definition'
import { createDefaultDocument, documentToValues, valuesToSettings } from './documentAdapter'

const definition = definePluginSettings({
  schema: z.object({
    enabled: z.boolean().default(true),
    delay: z.enum(['500', '1000']).default('500'),
  }),
})

describe('settings document adapter', () => {
  it('converts defaults to the existing backend envelope', () => {
    const document = createDefaultDocument('plugin', 'theory', definition)

    expect(document.settings.enabled).toMatchObject({ type: 'toggle', value: true })
    expect(document.settings.delay).toMatchObject({
      type: 'single_selection',
      params: { options: ['500', '1000'] },
      value: '500',
    })
  })

  it('restores values and applies defaults for missing fields', () => {
    const document = createDefaultDocument('plugin', 'theory', definition)
    document.settings.delay.value = '1000'

    expect(documentToValues(document, definition)).toEqual({ enabled: true, delay: '1000' })
    expect(
      documentToValues(
        { ...document, settings: { enabled: document.settings.enabled } },
        definition,
      ),
    ).toEqual({
      enabled: true,
      delay: '500',
    })
  })

  it('rejects values outside the Zod schema', () => {
    expect(() => valuesToSettings({ enabled: true, delay: '3000' }, definition)).toThrow(
      'Настройки не соответствуют схеме',
    )
  })
})
