import { describe, expect, it } from 'vitest'
import { parseAppConfig } from './schema'

const validRaw = {
  name: 'Mai',
  version: '0.1.0',
  description: 'Самообучающаяся платформа',
  mode: {
    default: 'development',
    available: ['development', 'production', 'release'],
    development: {
      debug: true,
      fake_data: true,
      hot_reload: true,
      database: { path: '.dev/mai_dev.db', max_connections: 5 },
    },
    production: {
      database: { path: 'storage/mai.db', max_connections: 5 },
    },
    release: {
      debug: false,
      database: { path: 'storage/mai.db', max_connections: 5 },
    },
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
      database: { path: '.dev/mai_dev.db', maxConnections: 5 },
    })
    expect(config.modes.production).toEqual({
      debug: false,
      fakeData: false,
      hotReload: false,
      database: { path: 'storage/mai.db', maxConnections: 5 },
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
      database: { path: 'storage/mai.db', maxConnections: 5 },
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

  it('применяет boolean-дефолты для неуказанных настроек режима', () => {
    const raw = {
      name: 'Mai',
      version: '0.0.1',
      mode: {
        default: 'release',
        available: ['release'],
        release: {
          database: { path: 'storage/mai.db', max_connections: 5 },
        },
      },
    }

    const config = parseAppConfig(raw)
    expect(config.modes.release).toEqual({
      debug: false,
      fakeData: false,
      hotReload: false,
      database: { path: 'storage/mai.db', maxConnections: 5 },
    })
  })

  it('не подставляет database для отсутствующей секции режима', () => {
    const raw = {
      name: 'Mai',
      version: '0.0.1',
      mode: { default: 'release', available: ['release'] },
    }

    expect(() => parseAppConfig(raw)).toThrow()
  })

  it('преобразует database из snake_case в camelCase', () => {
    const config = parseAppConfig(validRaw)

    expect(config.modes.development.database).toEqual({
      path: '.dev/mai_dev.db',
      maxConnections: 5,
    })
  })

  it('требует database.path в каждой доступной секции режима', () => {
    const raw = {
      ...validRaw,
      mode: {
        ...validRaw.mode,
        development: {
          ...validRaw.mode.development,
          database: { max_connections: 5 },
        },
      },
    }

    expect(() => parseAppConfig(raw)).toThrow()
  })

  it.each([0, -1, 1.5, 0x100000000])(
    'отклоняет невалидный database.max_connections: %s',
    (maxConnections) => {
      const raw = {
        ...validRaw,
        mode: {
          ...validRaw.mode,
          development: {
            ...validRaw.mode.development,
            database: { path: '.dev/mai_dev.db', max_connections: maxConnections },
          },
        },
      }

      expect(() => parseAppConfig(raw)).toThrow()
    },
  )

  it('отбрасывает невалидный default', () => {
    const raw = { ...validRaw, mode: { ...validRaw.mode, default: 'staging' } }
    expect(() => parseAppConfig(raw)).toThrow()
  })

  it('требует, чтобы default был среди available', () => {
    const raw = { ...validRaw, mode: { ...validRaw.mode, available: ['production', 'release'] } }
    expect(() => parseAppConfig(raw)).toThrow()
  })
})
