import type { SettingsField as SettingsFieldModel } from '../../core'
import { DateControl } from '../controls/DateControl'
import { MultiSelectionControl } from '../controls/MultiSelectionControl'
import { SingleSelectionControl } from '../controls/SingleSelectionControl'
import { TextControl } from '../controls/TextControl'
import { ToggleControl } from '../controls/ToggleControl'
import { UrlControl } from '../controls/UrlControl'
import { SettingsFieldRow } from './SettingsFieldRow'

export interface SettingsFieldRendererProps {
  /** Ключ поля в документе пункта. */
  fieldKey: string
  /** Поле self-describing модели настроек. */
  field: SettingsFieldModel
  /** Подпись поля (из i18n потребителя). */
  label: string
  hint?: string
  error?: string
  /** Подписи вариантов для selection-полей. */
  labels?: Record<string, string>
  disabled?: boolean
  onChange: (value: unknown) => void
}

/** Строковые варианты из `params.options`. */
function readOptions(params: SettingsFieldModel['params']): string[] {
  const raw = params?.options
  if (!Array.isArray(raw)) return []

  return raw.filter((item): item is string => typeof item === 'string')
}

/** Числовой параметр поля (например, `maxLength`). */
function readNumber(params: SettingsFieldModel['params'], key: string): number | undefined {
  const raw = params?.[key]

  return typeof raw === 'number' ? raw : undefined
}

/** Строки из значения поля-массива. */
function readStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is string => typeof item === 'string')
}

/** Рендер поля настроек подходящим контролом по `field.type`. */
export function SettingsFieldRenderer({
  fieldKey,
  field,
  label,
  hint,
  error,
  labels,
  disabled,
  onChange,
}: SettingsFieldRendererProps) {
  const id = `setting-${fieldKey}`

  const renderControl = () => {
    switch (field.type) {
      case 'toggle':
        return (
          <ToggleControl
            id={id}
            value={Boolean(field.value)}
            onChange={onChange}
            disabled={disabled}
          />
        )
      case 'single_selection':
        return (
          <SingleSelectionControl
            id={id}
            value={typeof field.value === 'string' ? field.value : ''}
            options={readOptions(field.params)}
            labels={labels}
            onChange={onChange}
            disabled={disabled}
          />
        )
      case 'multi_selection':
        return (
          <MultiSelectionControl
            value={readStrings(field.value)}
            options={readOptions(field.params)}
            labels={labels}
            onChange={onChange}
            disabled={disabled}
          />
        )
      case 'text_input':
        return (
          <TextControl
            id={id}
            value={typeof field.value === 'string' ? field.value : ''}
            maxLength={readNumber(field.params, 'maxLength')}
            onChange={onChange}
            disabled={disabled}
          />
        )
      case 'url_input':
        return (
          <UrlControl
            id={id}
            value={typeof field.value === 'string' ? field.value : ''}
            maxLength={readNumber(field.params, 'maxLength')}
            onChange={onChange}
            disabled={disabled}
          />
        )
      case 'date_input':
        return (
          <DateControl
            id={id}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={onChange}
            disabled={disabled}
          />
        )
      default:
        return null
    }
  }

  const control = renderControl()
  if (control === null) return null

  return (
    <SettingsFieldRow label={label} htmlFor={id} hint={hint} error={error}>
      {control}
    </SettingsFieldRow>
  )
}
