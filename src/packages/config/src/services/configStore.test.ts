import { getDefaultStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendConfigGet } from '../api/getConfig'
import { subscribeConfigChanged } from '../api/subscribeConfig'
import { defaultConfig } from '../core/defaults'
import { appConfigAtom, getAppConfig, initAppConfig } from './configStore'

vi.mock('../api/getConfig', () => ({
  sendConfigGet: vi.fn(),
}))
vi.mock('../api/subscribeConfig', () => ({
  subscribeConfigChanged: vi.fn(() => Promise.resolve(vi.fn())),
}))

const mockedGet = vi.mocked(sendConfigGet)
const mockedSubscribe = vi.mocked(subscribeConfigChanged)

const validRaw = {
  name: 'Mai',
  version: '0.2.0',
  description: 'Описание',
  mode: {
    default: 'development',
    available: ['development', 'production', 'release'],
    development: { debug: true, fake_data: true, hot_reload: true },
    production: {},
    release: {},
  },
}

beforeEach(() => {
  vi.clearAllMocks()
  getDefaultStore().set(appConfigAtom, defaultConfig)
})

describe('initAppConfig', () => {
  it('загружает конфиг с бэкенда и пишет в атом', async () => {
    mockedGet.mockResolvedValue(validRaw)

    const config = await initAppConfig()

    expect(mockedSubscribe).toHaveBeenCalledOnce()
    expect(config.mode).toBe('development')
    expect(config.modeConfig.fakeData).toBe(true)
    expect(getAppConfig().name).toBe('Mai')
    expect(getDefaultStore().get(appConfigAtom).version).toBe('0.2.0')
  })

  it('при ошибке чтения оставляет конфиг по умолчанию', async () => {
    mockedGet.mockRejectedValue(new Error('no tauri'))

    const config = await initAppConfig()

    expect(config).toEqual(defaultConfig)
    expect(getDefaultStore().get(appConfigAtom)).toEqual(defaultConfig)
  })
})
