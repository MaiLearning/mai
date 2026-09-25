import { describe, expect, it } from 'vitest'
import { GENERAL_ITEM_ID, SYSTEM_DOMAIN } from './constants'
import { createDefaultDocument } from './documentAdapter'
import { parseSettingsDocument } from './schema'
import { systemSettingsDefinition } from './systemSettings'

function systemDocument() {
  return createDefaultDocument(SYSTEM_DOMAIN, GENERAL_ITEM_ID, systemSettingsDefinition)
}

describe('parseSettingsDocument', () => {
  it('парсит документ системных настроек', () => {
    const doc = parseSettingsDocument(systemDocument())

    expect(doc.domain).toBe('system')
    expect(doc.itemId).toBe('general')
    expect(doc.schemaVersion).toBe(1)
  })

  it('отбрасывает неизвестный домен', () => {
    const raw = { ...systemDocument(), domain: 'user' }
    expect(() => parseSettingsDocument(raw)).toThrow()
  })

  it('требует карту полей settings', () => {
    const { settings: _settings, ...withoutSettings } = systemDocument()
    expect(() => parseSettingsDocument(withoutSettings)).toThrow()
  })

  it('значение поля может быть произвольным (валидит бэкенд)', () => {
    const raw = systemDocument()
    raw.settings.theme = { ...raw.settings.theme, value: 42 }

    expect(parseSettingsDocument(raw).settings.theme.value).toBe(42)
  })
})
