import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { definePluginSettings } from './definition'

describe('definePluginSettings', () => {
  it('builds JSON Schema and defaults from a Zod object', () => {
    const definition = definePluginSettings({
      i18nNamespace: 'theory',
      schema: z.object({
        enabled: z.boolean().default(true),
        delay: z.enum(['500', '1000']).default('500'),
      }),
    })

    expect(definition.defaults).toEqual({ enabled: true, delay: '500' })
    expect(definition.jsonSchema).toMatchObject({
      $schema: 'http://json-schema.org/draft-07/schema#',
    })
    expect(definition.jsonSchema).toMatchObject({
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        delay: { type: 'string' },
      },
    })
  })
})
