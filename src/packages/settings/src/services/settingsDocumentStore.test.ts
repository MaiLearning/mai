import { getDefaultStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { sendSettingsDelete, sendSettingsGet, sendSettingsUpdate } from '../api'
import { GENERAL_ITEM_ID, SYSTEM_DOMAIN } from '../core/constants'
import { definePluginSettings } from '../core/definition'
import {
  loadSettingsDocument,
  readSettingsState,
  resetSettingsDocument,
  type SettingsValues,
  saveSettingsValues,
  setSettingsValues,
  settingsDefinitionSignature,
  settingsDocumentFamily,
  settingsStateKey,
} from './settingsDocumentStore'

vi.mock('../api', () => ({
  sendSettingsGet: vi.fn(),
  sendSettingsUpdate: vi.fn(),
  sendSettingsDelete: vi.fn(),
}))

const mockedGet = vi.mocked(sendSettingsGet)
const mockedUpdate = vi.mocked(sendSettingsUpdate)
const mockedDelete = vi.mocked(sendSettingsDelete)

const definition = definePluginSettings({
  schema: z.object({
    enabled: z.boolean().default(true),
    delay: z.enum(['500', '1000']).default('500'),
  }),
})

const DOMAIN = SYSTEM_DOMAIN
const ITEM = GENERAL_ITEM_ID
const KEY = settingsStateKey(DOMAIN, ITEM)
const store = getDefaultStore()

const stateAtom = settingsDocumentFamily(KEY)

function readState() {
  return readSettingsState(KEY)
}

/** Сырой документ пункта, каким его отдаёт бэкенд. */
function storedDocument(values: SettingsValues) {
  return {
    domain: DOMAIN,
    itemId: ITEM,
    settings: {
      enabled: { type: 'toggle', default: true, value: values.enabled },
      delay: {
        type: 'single_selection',
        params: { options: ['500', '1000'] },
        default: '500',
        value: values.delay,
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

describe('loadSettingsDocument', () => {
  it('читает документ и отдаёт значения определения', async () => {
    mockedGet.mockResolvedValue(storedDocument({ enabled: false, delay: '1000' }))

    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    expect(mockedGet).toHaveBeenCalledWith(DOMAIN, ITEM)
    expect(readState().values).toEqual({ enabled: false, delay: '1000' })
    expect(readState().signature).toBe(settingsDefinitionSignature(definition))
    expect(readState().error).toBeNull()
    expect(readState().loading).toBe(false)
  })

  it('отсутствующий пункт — дефолты определения', async () => {
    mockedGet.mockResolvedValue(null)

    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    expect(readState().values).toEqual({ enabled: true, delay: '500' })
    expect(readState().document?.settings.delay.value).toBe('500')
  })

  it('повторный вызов для той же подписи не читает бэкенд', async () => {
    mockedGet.mockResolvedValue(null)

    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    expect(mockedGet).toHaveBeenCalledTimes(1)
  })

  it('ошибка чтения: ошибка в состоянии, подпись не выставляется', async () => {
    mockedGet.mockRejectedValue(new Error('no tauri'))

    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    expect(readState().error).toBe('no tauri')
    expect(readState().loading).toBe(false)
    expect(readState().signature).toBeNull()
  })

  it('документ другого пункта не принимается', async () => {
    mockedGet.mockResolvedValue({
      ...storedDocument({ enabled: true, delay: '500' }),
      itemId: 'other',
    })

    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    expect(readState().error).toBe('Документ настроек принадлежит другому пункту')
  })

  it('несовместимый документ: дефолты и ошибка, сброс остаётся доступным', async () => {
    mockedGet.mockResolvedValue(storedDocument({ enabled: true, delay: '3000' }))

    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    expect(readState().values).toEqual({ enabled: true, delay: '500' })
    expect(readState().error).toBe('Настройки не соответствуют схеме')
    expect(readState().document).not.toBeNull()
  })
})

describe('setSettingsValues', () => {
  it('меняет значения только при совпадении подписи определения', async () => {
    mockedGet.mockResolvedValue(null)
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    const signature = settingsDefinitionSignature(definition)

    setSettingsValues(KEY, signature, { enabled: false, delay: '500' })
    expect(readState().values).toEqual({ enabled: false, delay: '500' })

    setSettingsValues(KEY, 'другая-подпись', { enabled: true, delay: '1000' })
    expect(readState().values).toEqual({ enabled: false, delay: '500' })
  })
})

describe('saveSettingsValues', () => {
  it('пишет полную замену документа и обновляет значения', async () => {
    mockedGet.mockResolvedValue(null)
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    mockedUpdate.mockImplementation(async (domain, itemId, settings) => ({
      domain,
      itemId,
      settings,
      schemaVersion: 1,
      createdAt: 1,
      updatedAt: 2,
    }))

    const saved = await saveSettingsValues(KEY, definition, DOMAIN, ITEM, {
      enabled: false,
      delay: '1000',
    })

    expect(saved).toBe(true)
    expect(mockedUpdate).toHaveBeenCalledWith(DOMAIN, ITEM, {
      enabled: { type: 'toggle', default: true, value: false },
      delay: {
        type: 'single_selection',
        params: { options: ['500', '1000'] },
        default: '500',
        value: '1000',
      },
    })
    expect(readState().values).toEqual({ enabled: false, delay: '1000' })
    expect(readState().saving).toBe(false)
    expect(readState().error).toBeNull()
  })

  it('значения вне схемы определения на бэкенд не уходят', async () => {
    mockedGet.mockResolvedValue(null)
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)

    const saved = await saveSettingsValues(KEY, definition, DOMAIN, ITEM, {
      enabled: 'yes',
      delay: '500',
    })

    expect(saved).toBe(false)
    expect(mockedUpdate).not.toHaveBeenCalled()
  })

  it('ошибка записи: откат к документу и текст ошибки', async () => {
    mockedGet.mockResolvedValue(storedDocument({ enabled: true, delay: '1000' }))
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    mockedUpdate.mockRejectedValue(new Error('validation failed'))

    const saved = await saveSettingsValues(KEY, definition, DOMAIN, ITEM, {
      enabled: false,
      delay: '1000',
    })

    expect(saved).toBe(false)
    expect(readState().error).toBe('validation failed')
    expect(readState().values).toEqual({ enabled: true, delay: '1000' })
    expect(readState().saving).toBe(false)
  })

  it('записи по одному пункту уходят на бэкенд по очереди', async () => {
    mockedGet.mockResolvedValue(null)
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    const order: unknown[] = []
    mockedUpdate.mockImplementation(async (domain, itemId, settings) => {
      order.push(settings.delay?.value)
      await Promise.resolve()

      return { domain, itemId, settings, schemaVersion: 1, createdAt: 1, updatedAt: 1 }
    })

    await Promise.all([
      saveSettingsValues(KEY, definition, DOMAIN, ITEM, { enabled: true, delay: '500' }),
      saveSettingsValues(KEY, definition, DOMAIN, ITEM, { enabled: true, delay: '1000' }),
    ])

    expect(order).toEqual(['500', '1000'])
    expect(readState().values).toEqual({ enabled: true, delay: '1000' })
  })
})

describe('resetSettingsDocument', () => {
  it('удаляет документ пункта и возвращает дефолты', async () => {
    mockedGet.mockResolvedValue(storedDocument({ enabled: false, delay: '1000' }))
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    mockedDelete.mockResolvedValue(true)

    expect(await resetSettingsDocument(KEY, definition, DOMAIN, ITEM)).toBe(true)
    expect(mockedDelete).toHaveBeenCalledWith(DOMAIN, ITEM)
    expect(readState().values).toEqual({ enabled: true, delay: '500' })
    expect(readState().document?.settings.enabled.value).toBe(true)
    expect(readState().saving).toBe(false)
  })

  it('ошибка удаления: значения откатываются к документу', async () => {
    mockedGet.mockResolvedValue(storedDocument({ enabled: false, delay: '1000' }))
    await loadSettingsDocument(KEY, definition, DOMAIN, ITEM)
    mockedDelete.mockRejectedValue(new Error('db down'))

    expect(await resetSettingsDocument(KEY, definition, DOMAIN, ITEM)).toBe(false)
    expect(readState().error).toBe('db down')
    expect(readState().values).toEqual({ enabled: false, delay: '1000' })
  })
})
