import { describe, expect, it } from 'vitest'
import { assign, chipOwner, unassign } from './assign'

describe('assign', () => {
  it('приставляет фишку к термину', () => {
    expect(assign({}, 't1', 'c1')).toEqual({ t1: 'c1' })
  })

  it('заменяет прежнее значение термина', () => {
    expect(assign({ t1: 'c1' }, 't1', 'c2')).toEqual({ t1: 'c2' })
  })

  it('убирает фишку у прежнего владельца', () => {
    expect(assign({ t1: 'c1', t2: 'c2' }, 't3', 'c1')).toEqual({ t2: 'c2', t3: 'c1' })
  })

  it('то же значение — тот же референс без мутаций', () => {
    const mapping = { t1: 'c1' }
    expect(assign(mapping, 't1', 'c1')).toBe(mapping)
  })

  it('исходный мэппинг не мутирует', () => {
    const mapping = { t1: 'c1' }
    assign(mapping, 't2', 'c1')
    expect(mapping).toEqual({ t1: 'c1' })
  })
})

describe('unassign', () => {
  it('снимает фишку с термина', () => {
    expect(unassign({ t1: 'c1', t2: 'c2' }, 't1')).toEqual({ t2: 'c2' })
  })

  it('отсутствующий ключ — тот же референс', () => {
    const mapping = { t1: 'c1' }
    expect(unassign(mapping, 't9')).toBe(mapping)
  })
})

describe('chipOwner', () => {
  it('возвращает владельца фишки', () => {
    expect(chipOwner({ t1: 'c1', t2: 'c2' }, 'c2')).toBe('t2')
  })

  it('фишка без владельца — null', () => {
    expect(chipOwner({ t1: 'c1' }, 'c9')).toBeNull()
  })
})
