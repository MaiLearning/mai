import { getDefaultStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendSettingsGet, sendSettingsUpdate } from '../api'
import { defaultSystemSettings } from '../core/defaults'
import {
  getSystemSettings,
  initSystemSettings,
  systemLanguageAtom,
  systemSettingsAtom,
  systemThemeAtom,
  updateSystemSettings,
} from './settingsStore'

vi.mock('../api', () => ({
  sendSettingsGet: vi.fn(),
  sendSettingsUpdate: vi.fn(),
}))

const mockedGet = vi.mocked(sendSettingsGet)
const mockedUpdate = vi.mocked(sendSettingsUpdate)
const store = getDefaultStore()

function storedDocument(theme: string, language: string) {
  const doc = defaultSystemSettings()
  doc.settings.theme = { ...doc.settings.theme, value: theme }
  doc.settings.language = { ...doc.settings.language, value: language }

  return doc
}

beforeEach(() => {
  vi.clearAllMocks()
  store.set(systemSettingsAtom, defaultSystemSettings())
})

describe('initSystemSettings', () => {
  it('пишет загруженный документ в атом', async () => {
    mockedGet.mockResolvedValue(storedDocument('dark', 'en'))

    await initSystemSettings()

    expect(mockedGet).toHaveBeenCalledWith('system', 'general')
    expect(store.get(systemThemeAtom)).toBe('dark')
    expect(store.get(systemLanguageAtom)).toBe('en')
  })

  it('нет пункта в БД — остаются дефолты', async () => {
    mockedGet.mockResolvedValue(null)

    await initSystemSettings()

    expect(getSystemSettings()).toEqual(defaultSystemSettings())
  })

  it('ошибка чтения — дефолты, исключение не пробрасывается', async () => {
    mockedGet.mockRejectedValue(new Error('no tauri'))

    await expect(initSystemSettings()).resolves.toEqual(defaultSystemSettings())
    expect(store.get(systemThemeAtom)).toBe('system')
  })
})

describe('updateSystemSettings', () => {
  it('мержит патч в текущий документ и сохраняет итог', async () => {
    store.set(systemSettingsAtom, storedDocument('system', 'ru'))
    mockedUpdate.mockResolvedValue(storedDocument('dark', 'ru'))

    await updateSystemSettings({ theme: 'dark' })

    expect(mockedUpdate).toHaveBeenCalledTimes(1)
    const sent = mockedUpdate.mock.calls[0][2]
    expect(sent.theme?.value).toBe('dark')
    expect(sent.language?.value).toBe('ru')
    expect(store.get(systemThemeAtom)).toBe('dark')
  })

  it('пробрасывает ошибку сохранения', async () => {
    mockedUpdate.mockRejectedValue(new Error('validation'))

    await expect(updateSystemSettings({ language: 'en' })).rejects.toThrow('validation')
  })
})
