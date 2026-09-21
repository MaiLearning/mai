import { describe, expect, it } from 'vitest'
import { MIN_EDITOR_LINES, padToLines, stripTrailingEmpty } from './padLines'

describe('padToLines', () => {
  it('пустое значение даёт минимум пустых строк (10 переводов строки = 10 строк документа)', () => {
    expect(padToLines('')).toBe('\n'.repeat(MIN_EDITOR_LINES - 1))
  })

  it('одна строка кода добивается до минимума', () => {
    expect(padToLines('hello')).toBe('hello' + '\n'.repeat(MIN_EDITOR_LINES - 1))
  })

  it('текст длиннее минимума не меняется', () => {
    const code = Array.from({ length: 15 }, (_, i) => `line ${i}`).join('\n')

    expect(padToLines(code)).toBe(code)
  })

  it('концевые пустые строки срезаются перед паддингом (idempotent)', () => {
    const padded = padToLines('hello')

    expect(padToLines(padded)).toBe(padded)
    expect(padToLines('hello\n\n\n')).toBe(padToLines('hello'))
  })
})

describe('stripTrailingEmpty', () => {
  it('срезает концевые пустые строки', () => {
    expect(stripTrailingEmpty('hello\n\n\n')).toBe('hello')
  })

  it('срезает концевые строки с пробелами, но не пробелы в коде', () => {
    expect(stripTrailingEmpty('hello\n \n\t\n')).toBe('hello')
    expect(stripTrailingEmpty('hello ')).toBe('hello ')
  })

  it('пустой и отсутствующий контент остаются пустыми', () => {
    expect(stripTrailingEmpty('')).toBe('')
    expect(stripTrailingEmpty('\n\n')).toBe('')
  })

  it('текст без концевых переводов строки не меняется', () => {
    expect(stripTrailingEmpty('a\nb')).toBe('a\nb')
  })
})
