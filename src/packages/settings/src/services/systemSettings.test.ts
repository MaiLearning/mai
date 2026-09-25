import { getDefaultStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendSettingsGet } from '../api'
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from '../core/constants'
import { settingsDocumentFamily } from './settingsDocumentStore'
import {
  getSystemSettings,
  initSystemSettings,
  systemLanguageAtom,
  systemSettingsAtom,
  systemSettingsKey,
  systemThemeAtom,
} from './systemSettings'

vi.mock('../api', () => ({
  sendSettingsGet: vi.fn(),
  sendSettingsUpdate: vi.fn(),
  sendSettingsDelete: vi.fn(),
}))

const mockedGet = vi.mocked(sendSettingsGet)
const store = getDefaultStore()
const stateAtom = settingsDocumentFamily(systemSettingsKey)

/** Документ «Общие», каким его отдаёт бэкенд. */
function storedDocument(theme: string, language: string) {
  return {
    domain: 'system',
    itemId: 'general',
    settings: {
      theme: {
        type: 'single_selection',
        params: { options: ['system', 'light', 'dark'] },
        default: 'system',
        value: theme,
      },
      language: {
        type: 'single_selection',
        params: { options: ['ru', 'en'] },
        default: 'ru',
        value: language,
      },
    },
    schemaVersion: 1,
    createdAt: 1,
    updatedAt: 1,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  store.set(stateAtom, {
    document: null,
    values: {},
    signature: null,
    loading: false,
    saving: false,
    error: null,
  })
})

describe('initSystemSettings', () => {
  it('пишет загруженный документ в общий стор', async () => {
    mockedGet.mockResolvedValue(storedDocument('dark', 'en'))

    await initSystemSettings()

    expect(mockedGet).toHaveBeenCalledWith('system', 'general')
    expect(store.get(systemThemeAtom)).toBe('dark')
    expect(store.get(systemLanguageAtom)).toBe('en')
    expect(store.get(systemSettingsAtom).itemId).toBe('general')
  })

  it('нет пункта в БД — дефолты определения', async () => {
    mockedGet.mockResolvedValue(null)

    const document = await initSystemSettings()

    expect(document.settings.theme.value).toBe(DEFAULT_THEME)
    expect(store.get(systemLanguageAtom)).toBe(DEFAULT_LANGUAGE)
    expect(getSystemSettings()).toEqual(document)
  })

  it('ошибка чтения — дефолты, исключение не пробрасывается', async () => {
    mockedGet.mockRejectedValue(new Error('no tauri'))

    await expect(initSystemSettings()).resolves.toBeDefined()
    expect(store.get(systemThemeAtom)).toBe('system')
    expect(store.get(systemLanguageAtom)).toBe('ru')
  })
})

describe('системные значения', () => {
  it('читаются из значений пункта, а не только из документа', async () => {
    mockedGet.mockResolvedValue(null)
    await initSystemSettings()

    store.set(stateAtom, {
      ...store.get(stateAtom),
      values: { theme: 'light', language: 'en' },
    })

    expect(store.get(systemThemeAtom)).toBe('light')
    expect(store.get(systemLanguageAtom)).toBe('en')
  })

  it('неизвестное значение поля подменяется дефолтом', () => {
    store.set(stateAtom, {
      document: null,
      values: { theme: 'neon', language: 'de' },
      signature: null,
      loading: false,
      saving: false,
      error: null,
    })

    expect(store.get(systemThemeAtom)).toBe(DEFAULT_THEME)
    expect(store.get(systemLanguageAtom)).toBe(DEFAULT_LANGUAGE)
  })
})
