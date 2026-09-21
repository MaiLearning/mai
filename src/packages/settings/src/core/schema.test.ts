import { describe, expect, it } from 'vitest'
import { defaultSystemSettings } from './defaults'
import { parseSettingsDocument } from './schema'

describe('parseSettingsDocument', () => {
  it('парсит документ системных настроек', () => {
    const doc = parseSettingsDocument(defaultSystemSettings())

    expect(doc.domain).toBe('system')
    expect(doc.itemId).toBe('general')
    expect(doc.schemaVersion).toBe(1)
  })

  it('отбрасывает неизвестный домен', () => {
    const raw = { ...defaultSystemSettings(), domain: 'user' }
    expect(() => parseSettingsDocument(raw)).toThrow()
  })

  it('требует карту полей settings', () => {
    const { settings: _settings, ...withoutSettings } = defaultSystemSettings()
    expect(() => parseSettingsDocument(withoutSettings)).toThrow()
  })

  it('значение поля может быть произвольным (валидит бэкенд)', () => {
    const raw = defaultSystemSettings()
    raw.settings.theme = { ...raw.settings.theme, value: 42 }

    expect(parseSettingsDocument(raw).settings.theme.value).toBe(42)
  })
})
