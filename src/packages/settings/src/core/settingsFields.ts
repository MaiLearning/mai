import type { SettingsDefinition } from './definition'
import { fieldFromJsonSchema } from './documentAdapter'
import { type SettingsJsonProperty, schemaProperties } from './jsonSchema'
import type { SettingsField } from './model'

/**
 * Ключ подписи поля: `title` из JSON Schema (автор схемы задаёт его через
 * `.meta({ title })`), иначе конвенция `<поле>.label` в namespace определения.
 */
export function fieldLabelKey(key: string, property: SettingsJsonProperty): string {
  return property.title ?? `${key}.label`
}

/** Ключ пояснения поля: `description` из JSON Schema или `<поле>.hint`. */
export function fieldHintKey(key: string, property: SettingsJsonProperty): string {
  return property.description ?? `${key}.hint`
}

/** Ключ подписи варианта выбора: `<поле>.options.<значение>`. */
export function optionLabelKey(key: string, option: string): string {
  return `${key}.options.${option}`
}

/** Готовое к рендеру описание поля: ключ, self-describing модель, ключи переводов. */
export type SettingsFieldSpec = {
  /** Ключ поля в документе пункта. */
  key: string
  /** Поле self-describing модели настроек. */
  field: SettingsField
  /** Ключ перевода подписи. */
  labelKey: string
  /** Ключ перевода пояснения; отсутствие перевода — пояснение не показывается. */
  hintKey: string
  /** Ключи подписей вариантов (`значение → ключ`) для selection-полей. */
  optionLabelKeys?: Record<string, string>
}

function optionLabelKeys(key: string, field: SettingsField): Record<string, string> | undefined {
  if (field.type !== 'single_selection' && field.type !== 'multi_selection') return undefined
  const options = field.params?.options
  if (!Array.isArray(options)) return undefined

  return Object.fromEntries(
    options
      .filter((option): option is string => typeof option === 'string')
      .map((option) => [option, optionLabelKey(key, option)]),
  )
}

/**
 * Поля формы настроек в порядке свойств JSON Schema: self-describing модель
 * (тип / params / дефолт / значение) плюс ключи переводов подписи, пояснения
 * и вариантов выбора. Неподдерживаемый тип — ошибка схемы плагина.
 */
export function settingsFieldSpecs(
  definition: SettingsDefinition,
  values: Record<string, unknown>,
): SettingsFieldSpec[] {
  const defaults = definition.defaults as Record<string, unknown>

  return Object.entries(schemaProperties(definition.jsonSchema)).map(([key, property]) => {
    const defaultValue = defaults[key]
    const field = fieldFromJsonSchema(property, defaultValue, values[key] ?? defaultValue)

    return {
      key,
      field,
      labelKey: fieldLabelKey(key, property),
      hintKey: fieldHintKey(key, property),
      optionLabelKeys: optionLabelKeys(key, field),
    }
  })
}
