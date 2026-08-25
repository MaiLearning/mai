import { describe, expect, it } from 'vitest'
import type { ResourceType } from '@/entities/resource'
import { resolveTypeKeys } from './init'

function makeType(overrides: Partial<ResourceType>): ResourceType {
  return {
    key: 'theory',
    name: 'Теория',
    description: null,
    pluginId: null,
    supportedExtensions: [],
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

describe('resolveTypeKeys', () => {
  it('возвращает только типы, принадлежащие плагину', () => {
    const types = [
      makeType({ key: 'theory', name: 'Теория', pluginId: 'internal-theory' }),
      makeType({ key: 'task', name: 'Задача', pluginId: 'internal-tasks' }),
      makeType({ key: 'free', name: 'Свободный', pluginId: null }),
    ]
    const result = resolveTypeKeys('internal-theory', types)

    expect(result).toEqual([{ key: 'theory', name: 'Теория' }])
  })

  it('возвращает пустой массив, если типов у плагина нет', () => {
    const result = resolveTypeKeys('unknown', [makeType({ pluginId: 'internal-theory' })])

    expect(result).toEqual([])
  })
})
