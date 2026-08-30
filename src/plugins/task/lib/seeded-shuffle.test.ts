import { describe, expect, it } from 'vitest'
import { seededShuffle } from './seeded-shuffle'

const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

describe('seededShuffle', () => {
  it('одинаковый seed — одинаковый порядок', () => {
    expect(seededShuffle(items, 'task-1')).toEqual(seededShuffle(items, 'task-1'))
  })

  it('другой seed — другой порядок', () => {
    expect(seededShuffle(items, 'task-1')).not.toEqual(seededShuffle(items, 'task-2'))
  })

  it('результат — перестановка исходных элементов', () => {
    expect([...seededShuffle(items, 'task-3')].sort()).toEqual([...items].sort())
  })

  it('пустой и одиночный списки не ломаются', () => {
    expect(seededShuffle([], 's')).toEqual([])
    expect(seededShuffle(['x'], 's')).toEqual(['x'])
  })
})
