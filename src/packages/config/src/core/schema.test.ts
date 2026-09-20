import { describe, expect, it } from 'vitest'
import { parseAppConfig } from './schema'

const validRaw = {
  name: 'Mai',
  version: '0.1.0',
  description: 'Самообучающаяся платформа',
  mode: {
    default: 'development',
    available: ['development', 'production', 'release'],
    development: { debug: true, fake_data: true, hot_reload: true },
    production: {},
    release: { debug: false },
  },
}

describe('parseAppConfig', () => {
  it('парсит полный конфиг и собирает секции режимов', () => {
    const config = parseAppConfig(validRaw)

    expect(config.mode).toBe('development')
    expect(config.modeConfig).toEqual({
      debug: true,
      fakeData: true,
      hotReload: true,
    })
    expect(config.modes.production).toEqual({
      debug: false,
      fakeData: false,
      hotReload: false,
    })
  })

  it('применяет настройки активного режима из default', () => {
    const raw = {
      ...validRaw,
      mode: { ...validRaw.mode, default: 'production' },
    }

    const config = parseAppConfig(raw)
    expect(config.mode).toBe('production')
    expect(config.modeConfig).toEqual({
      debug: false,
      fakeData: false,
      hotReload: false,
    })
  })

  it('не ломается от неизвестных ключей внутри секции (расширение схемы)', () => {
    const raw = {
      ...validRaw,
      mode: {
        ...validRaw.mode,
        development: { ...validRaw.mode.development, server: { host: 'localhost', port: 8000 } },
      },
    }

    expect(() => parseAppConfig(raw)).not.toThrow()
    expect(parseAppConfig(raw).modes.development.debug).toBe(true)
  })

  it('отсутствующая секция режима даёт настройки по умолчанию', () => {
    const raw = {
      name: 'Mai',
      version: '0.0.1',
      mode: { default: 'release', available: ['release'] },
    }

    const config = parseAppConfig(raw)
    expect(config.modes.release).toEqual({
      debug: false,
      fakeData: false,
      hotReload: false,
    })
  })

  it('отбрасывает невалидный default', () => {
    const raw = { ...validRaw, mode: { ...validRaw.mode, default: 'staging' } }
    expect(() => parseAppConfig(raw)).toThrow()
  })

  it('требует, чтобы default был среди available', () => {
    const raw = { ...validRaw, mode: { ...validRaw.mode, available: ['production', 'release'] } }
    expect(() => parseAppConfig(raw)).toThrow()
  })
})
