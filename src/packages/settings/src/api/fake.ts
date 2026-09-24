import { fakeNow, fakeState } from '@mai/fakeData'
import type { SettingsDocument } from '../core/model'
import { parseSettingsDocument } from '../core/schema'

/** Ключ документа настроек в fake-состоянии: `domain:itemId`. */
function settingsKey(domain: string, itemId: string): string {
  return `${domain}:${itemId}`
}

export function fakeSendSettingsGet(domain: string, itemId: string): Promise<unknown> {
  return Promise.resolve(fakeState.settings[settingsKey(domain, itemId)] ?? null)
}

export function fakeSendSettingsUpdate(
  domain: string,
  itemId: string,
  settings: SettingsDocument['settings'],
): Promise<unknown> {
  const key = settingsKey(domain, itemId)
  const current = fakeState.settings[key]
  const next = parseSettingsDocument({
    domain,
    itemId,
    settings,
    schemaVersion: current?.schemaVersion ?? 1,
    createdAt: current?.createdAt ?? fakeNow(),
    updatedAt: fakeNow(),
  })

  fakeState.settings[key] = next

  return Promise.resolve(next)
}

export function fakeSendSettingsDelete(domain: string, itemId: string): Promise<boolean> {
  const key = settingsKey(domain, itemId)
  if (!(key in fakeState.settings)) return Promise.resolve(false)

  delete fakeState.settings[key]

  return Promise.resolve(true)
}
