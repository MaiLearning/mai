import { DEFAULT_SCHEMA_VERSION } from './constants'
import type { SettingsDefinition } from './definition'
import { type SettingsJsonProperty, schemaItems, schemaProperties } from './jsonSchema'
import type { SettingsDocument, SettingsField } from './model'

function propertiesOf(definition: SettingsDefinition): Record<string, SettingsJsonProperty> {
  return schemaProperties(definition.jsonSchema)
}

function cloneJson<T>(value: T): T {
  if (value === undefined) return value

  return JSON.parse(JSON.stringify(value)) as T
}

function fieldType(property: SettingsJsonProperty): SettingsField['type'] {
  if (property.type === 'boolean') return 'toggle'
  if (property.type === 'string' && property.enum) return 'single_selection'
  if (property.type === 'array' && schemaItems(property)?.enum) return 'multi_selection'
  if (property.type === 'string' && property.format === 'uri') return 'url_input'
  if (property.type === 'string' && property.format === 'date') return 'date_input'
  if (property.type === 'string') return 'text_input'

  throw new Error(`Неподдерживаемый тип настройки: ${JSON.stringify(property)}`)
}

function fieldParams(property: SettingsJsonProperty): Record<string, unknown> | undefined {
  const options =
    property.enum ?? (property.type === 'array' ? schemaItems(property)?.enum : undefined)

  if (options) {
    if (!options.every((value) => typeof value === 'string')) {
      throw new Error('Настройки выбора должны содержать строковые значения')
    }

    return { options: [...options] }
  }

  if (property.type === 'string' && property.format === 'uri') {
    return property.maxLength === undefined ? undefined : { maxLength: property.maxLength }
  }

  if (
    property.type === 'string' &&
    (property.minLength !== undefined || property.maxLength !== undefined)
  ) {
    return {
      ...(property.minLength === undefined ? {} : { minLength: property.minLength }),
      ...(property.maxLength === undefined ? {} : { maxLength: property.maxLength }),
    }
  }

  return undefined
}

/** Self-describing поле из свойства JSON Schema: тип, params, дефолт, значение. */
export function fieldFromJsonSchema(
  schema: SettingsJsonProperty,
  defaultValue: unknown,
  value: unknown,
): SettingsField {
  return descriptorFor(schema, defaultValue, value)
}

function descriptorFor(
  property: SettingsJsonProperty,
  defaultValue: unknown,
  value: unknown,
): SettingsField {
  return {
    type: fieldType(property),
    params: fieldParams(property),
    default: cloneJson(defaultValue),
    value: cloneJson(value),
  }
}

function parsedValues(
  definition: SettingsDefinition,
  values: Record<string, unknown>,
): Record<string, unknown> {
  const result = definition.schema.safeParse(values)
  if (!result.success) throw new Error('Настройки не соответствуют схеме')

  return result.data as Record<string, unknown>
}

export function documentToValues(
  document: SettingsDocument | null,
  definition: SettingsDefinition,
): Record<string, unknown> {
  const values = cloneJson(definition.defaults) as Record<string, unknown>

  if (document) {
    for (const key of Object.keys(propertiesOf(definition))) {
      const value = document.settings[key]?.value
      if (value !== undefined) values[key] = cloneJson(value)
    }
  }

  return parsedValues(definition, values)
}

export function valuesToSettings(
  values: Record<string, unknown>,
  definition: SettingsDefinition,
): Record<string, SettingsField> {
  const defaults = definition.defaults as Record<string, unknown>
  const parsed = parsedValues(definition, values) as Record<string, unknown>
  const properties = propertiesOf(definition)
  const settings: Record<string, SettingsField> = {}

  for (const [key, property] of Object.entries(properties)) {
    settings[key] = descriptorFor(property, defaults[key], parsed[key])
  }

  return settings
}

export function createDefaultDocument(
  domain: SettingsDocument['domain'],
  itemId: string,
  definition: SettingsDefinition,
): SettingsDocument {
  return {
    domain,
    itemId,
    settings: valuesToSettings(definition.defaults, definition),
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    createdAt: 0,
    updatedAt: 0,
  }
}
