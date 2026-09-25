/**
 * Минимальная модель JSON Schema (draft-07), которую генерирует
 * `z.toJSONSchema` и потребляют адаптеры настроек. Хватает для типов полей,
 * зарегистрированных в реестре схем бэкенда (services/settings/schemas).
 */
export type SettingsJsonProperty = {
  type?: string | string[]
  title?: string
  description?: string
  default?: unknown
  enum?: unknown[]
  items?: SettingsJsonProperty | SettingsJsonProperty[]
  format?: string
  minLength?: number
  maxLength?: number
}

export type SettingsJsonSchema = SettingsJsonProperty & {
  properties?: Record<string, SettingsJsonProperty>
  required?: string[]
}

/** Свойства объекта-схемы: пустая карта, если схема не описывает объект. */
export function schemaProperties(schema: SettingsJsonSchema): Record<string, SettingsJsonProperty> {
  return schema.properties ?? {}
}

/** Схема элемента массива: `items` может быть как объектом, так и списком. */
export function schemaItems(property: SettingsJsonProperty): SettingsJsonProperty | undefined {
  return Array.isArray(property.items) ? property.items[0] : property.items
}
