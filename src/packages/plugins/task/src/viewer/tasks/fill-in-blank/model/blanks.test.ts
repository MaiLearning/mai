import { describe, expect, it } from 'vitest'
import { dropEmpty, makeBlank, reIdByPosition, removeBlank } from './blanks'

const seg = (id: string, text: string, blank: string | null = null) => ({ id, text, blank })

const segments = [seg('a', 'начало '), seg('b', 'один два три'), seg('c', ' конец')]

describe('makeBlank', () => {
  it('режет сегмент на [текст до, пропуск, текст после]', () => {
    expect(makeBlank(segments, 1, 5, 8, 'n1')).toEqual([
      seg('a', 'начало '),
      seg('b', 'один '),
      seg('n1', '', 'два'),
      seg('b', ' три'),
      seg('c', ' конец'),
    ])
  })

  it('выделение в начале — пустой кусок «до» не создаётся', () => {
    expect(makeBlank(segments, 1, 0, 4, 'n1')).toEqual([
      seg('a', 'начало '),
      seg('n1', '', 'один'),
      seg('b', ' два три'),
      seg('c', ' конец'),
    ])
  })

  it('выделение в конце — пустой кусок «после» не создаётся', () => {
    expect(makeBlank(segments, 1, 9, 12, 'n1')).toEqual([
      seg('a', 'начало '),
      seg('b', 'один два '),
      seg('n1', '', 'три'),
      seg('c', ' конец'),
    ])
  })

  it('пустое выделение — no-op', () => {
    expect(makeBlank(segments, 1, 3, 3, 'n1')).toBe(segments)
  })

  it('сегмент с пропуском повторно не режется', () => {
    const withBlank = [seg('a', 'текст', 'ответ')]
    expect(makeBlank(withBlank, 0, 0, 2, 'n1')).toBe(withBlank)
  })

  it('несуществующий индекс — no-op', () => {
    expect(makeBlank(segments, 9, 0, 2, 'n1')).toBe(segments)
  })
})

describe('removeBlank', () => {
  it('гасит пропуск, текст сегмента сохраняется', () => {
    const withBlank = [seg('a', 'до'), seg('b', '', 'ответ'), seg('c', 'после')]
    expect(removeBlank(withBlank, 1)).toEqual([seg('a', 'до'), seg('b', ''), seg('c', 'после')])
  })

  it('остальные сегменты не трогаются', () => {
    const withBlank = [seg('a', 'до'), seg('b', 'текст', 'ответ')]
    const result = removeBlank(withBlank, 1)
    expect(result[0]).toEqual(seg('a', 'до'))
    expect(result[1]).toEqual(seg('b', 'текст'))
  })
})

describe('reIdByPosition', () => {
  it('сегменты наследуют id по позиции', () => {
    const prev = [seg('p0', 'x'), seg('p1', 'y')]
    const next = [seg('t0', 'x!'), seg('t1', 'y!')]
    expect(reIdByPosition(next, prev, () => 'new')).toEqual([seg('p0', 'x!'), seg('p1', 'y!')])
  })

  it('новым сегментам в хвосте выдаются id из фабрики', () => {
    const prev = [seg('p0', 'x')]
    const next = [seg('t0', 'x'), seg('t1', 'y'), seg('t2', 'z')]
    let n = 0
    const result = reIdByPosition(next, prev, () => `new${++n}`)
    expect(result.map((s) => s.id)).toEqual(['p0', 'new1', 'new2'])
  })

  it('пустой prev — все id новые', () => {
    let n = 0
    const result = reIdByPosition([seg('t0', 'x'), seg('t1', 'y')], [], () => `n${++n}`)
    expect(result.map((s) => s.id)).toEqual(['n1', 'n2'])
  })

  it('принимает сегменты без id (разбор из DOM)', () => {
    const result = reIdByPosition([{ text: 'x', blank: null }], [seg('p0', 'x')], () => 'new')
    expect(result).toEqual([seg('p0', 'x')])
  })
})

describe('dropEmpty', () => {
  it('убирает сегменты без текста и без пропуска', () => {
    const mixed = [seg('a', 'x'), seg('b', ''), seg('c', '', 'ответ')]
    expect(dropEmpty(mixed)).toEqual([seg('a', 'x'), seg('c', '', 'ответ')])
  })
})
