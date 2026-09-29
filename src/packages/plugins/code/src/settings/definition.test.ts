import { settingsFieldSpecs } from '@mai/settings'
import { describe, expect, it } from 'vitest'
import { codeSettingsDefinition } from './definition'

describe('codeSettingsDefinition', () => {
  it('по умолчанию все рантаймы не настроены', () => {
    expect(codeSettingsDefinition.defaults).toEqual({
      pythonPath: '',
      javascriptPath: '',
      rustcPath: '',
    })
  })

  it('описывает пути как текстовые поля с ключами переводов', () => {
    const specs = settingsFieldSpecs(codeSettingsDefinition, codeSettingsDefinition.defaults)

    expect(specs.map((spec) => spec.key)).toEqual(['pythonPath', 'javascriptPath', 'rustcPath'])
    expect(specs.map((spec) => spec.field.type)).toEqual(['text_input', 'text_input', 'text_input'])
    expect(specs.map((spec) => spec.labelKey)).toEqual([
      'settings.pythonPath.label',
      'settings.javascriptPath.label',
      'settings.rustcPath.label',
    ])
    expect(specs.map((spec) => spec.hintKey)).toEqual([
      'settings.pythonPath.hint',
      'settings.javascriptPath.hint',
      'settings.rustcPath.hint',
    ])
  })
})
