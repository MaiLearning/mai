import { describe, expect, it } from 'vitest'
import { parseTheoryAutosaveDelay } from './autosaveDelay'

describe('parseTheoryAutosaveDelay', () => {
  it.each([
    ['500', 500],
    ['1000', 1000],
    ['2000', 2000],
  ])('преобразует допустимое значение %s', (value, expected) => {
    expect(parseTheoryAutosaveDelay(value)).toBe(expected)
  })

  it.each([undefined, null, 500, true, '3000', ''])(
    'возвращает задержку по умолчанию для значения %s',
    (value) => {
      expect(parseTheoryAutosaveDelay(value)).toBe(500)
    },
  )
})
