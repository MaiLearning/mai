import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { definePluginSettings } from './definition'
import {
  fieldHintKey,
  fieldLabelKey,
  optionLabelKey,
  type SettingsFieldSpec,
  settingsFieldSpecs,
} from './settingsFields'

const definition = definePluginSettings({
  i18nNamespace: 'theory',
  schema: z.object({
    autosaveDelay: z.enum(['500', '1000', '2000']).default('500').meta({
      title: 'settings.autosaveDelay.label',
      description: 'settings.autosaveDelay.hint',
    }),
    homepage: z.string().default('').meta({
      title: 'theory.homepage.title',
      description: 'theory.homepage.hint',
    }),
    autoSave: z.boolean().default(true),
    formats: z.array(z.enum(['theory', 'practice'])).default(['theory']),
  }),
})

function specOf(specs: SettingsFieldSpec[], key: string): SettingsFieldSpec {
  const spec = specs.find((item) => item.key === key)
  if (!spec) throw new Error(`Нет спецификации поля '${key}'`)

  return spec
}

describe('settingsFieldSpecs', () => {
  it('берёт ключи подписи и пояснения из meta схемы', () => {
    const specs = settingsFieldSpecs(definition, {})
    const delay = specOf(specs, 'autosaveDelay')
    const homepage = specOf(specs, 'homepage')

    expect(delay.labelKey).toBe('settings.autosaveDelay.label')
    expect(delay.hintKey).toBe('settings.autosaveDelay.hint')
    expect(homepage.labelKey).toBe('theory.homepage.title')
    expect(homepage.hintKey).toBe('theory.homepage.hint')
  })

  it('подставляет конвенцию ключей, если meta не задана', () => {
    const autoSave = specOf(settingsFieldSpecs(definition, {}), 'autoSave')

    expect(autoSave.labelKey).toBe('autoSave.label')
    expect(autoSave.hintKey).toBe('autoSave.hint')
    expect(autoSave.optionLabelKeys).toBeUndefined()
  })

  it('отдаёт self-describing модель поля с дефолтами и значениями', () => {
    const specs = settingsFieldSpecs(definition, { autosaveDelay: '2000', formats: [] })
    const delay = specOf(specs, 'autosaveDelay')

    expect(delay.field).toEqual({
      type: 'single_selection',
      params: { options: ['500', '1000', '2000'] },
      default: '500',
      value: '2000',
    })
    expect(specOf(specs, 'formats').field).toEqual({
      type: 'multi_selection',
      params: { options: ['theory', 'practice'] },
      default: ['theory'],
      value: [],
    })
    expect(specOf(specs, 'autoSave').field).toEqual({
      type: 'toggle',
      default: true,
      value: true,
    })
  })

  it('строит ключи подписей вариантов только для selection-полей', () => {
    const specs = settingsFieldSpecs(definition, {})

    expect(specOf(specs, 'autosaveDelay').optionLabelKeys).toEqual({
      '500': 'autosaveDelay.options.500',
      '1000': 'autosaveDelay.options.1000',
      '2000': 'autosaveDelay.options.2000',
    })
    expect(specOf(specs, 'formats').optionLabelKeys).toEqual({
      theory: 'formats.options.theory',
      practice: 'formats.options.practice',
    })
  })

  it('сохраняет порядок свойств схемы', () => {
    expect(settingsFieldSpecs(definition, {}).map(({ key }) => key)).toEqual([
      'autosaveDelay',
      'homepage',
      'autoSave',
      'formats',
    ])
  })

  it('бросает на неподдерживаемом типе настройки', () => {
    const withNumber = definePluginSettings({
      schema: z.object({ count: z.number().default(1) }),
    })

    expect(() => settingsFieldSpecs(withNumber, {})).toThrow('Неподдерживаемый тип настройки')
  })
})

describe('конвенция ключей переводов', () => {
  it('строит ключи из имени поля', () => {
    expect(fieldLabelKey('theme', {})).toBe('theme.label')
    expect(fieldHintKey('theme', {})).toBe('theme.hint')
    expect(optionLabelKey('theme', 'dark')).toBe('theme.options.dark')
  })

  it('предпочитает title и description из схемы', () => {
    expect(fieldLabelKey('theme', { title: 'theory.theme' })).toBe('theory.theme')
    expect(fieldHintKey('theme', { description: 'theory.themeHint' })).toBe('theory.themeHint')
  })
})
