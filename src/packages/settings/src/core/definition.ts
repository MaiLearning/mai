import { z } from 'zod'
import type { SettingsJsonSchema } from './jsonSchema'

export type SettingsSchema = z.ZodObject

export type SettingsDefinition<T extends SettingsSchema = SettingsSchema> = {
  schema: T
  jsonSchema: SettingsJsonSchema
  defaults: z.output<T>
  /** Namespace переводов определения (подписи полей, название раздела). */
  i18nNamespace: string
  /** Ключ названия раздела (заголовок формы настроек). */
  nameKey?: string
  /** Ключ пояснения раздела; нет — используется пояснение страницы настроек. */
  descriptionKey?: string
}

type SettingsDefinitionInput<T extends SettingsSchema> = {
  schema: T
  i18nNamespace?: string
  nameKey?: string
  descriptionKey?: string
}

export function definePluginSettings<T extends SettingsSchema>(
  input: SettingsDefinitionInput<T>,
): SettingsDefinition<T> {
  const jsonSchema = z.toJSONSchema(input.schema, {
    target: 'draft-07',
  }) as unknown as SettingsJsonSchema
  const defaults = input.schema.parse({})

  return {
    schema: input.schema,
    jsonSchema,
    defaults,
    i18nNamespace: input.i18nNamespace ?? 'settings',
    nameKey: input.nameKey,
    descriptionKey: input.descriptionKey,
  }
}

export const EMPTY_SETTINGS_DEFINITION = definePluginSettings({
  schema: z.object({}),
})
