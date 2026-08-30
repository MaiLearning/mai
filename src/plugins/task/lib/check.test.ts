import { describe, expect, it } from 'vitest'
import type { AnyTask } from '../core/types'
import { checkTask } from './check'

const choice = (id: string, correct = false) => ({ id, text: id.toUpperCase(), correct })

const tasks = {
  SingleChoice: {
    id: 't1',
    kind: 'SingleChoice',
    prompt: '',
    difficulty: 'easy',
    choices: [choice('a', true), choice('b')],
  },
  MultipleChoice: {
    id: 't2',
    kind: 'MultipleChoice',
    prompt: '',
    difficulty: 'easy',
    choices: [choice('a', true), choice('b', true), choice('c')],
  },
  TrueFalse: { id: 't3', kind: 'TrueFalse', prompt: '', difficulty: 'easy', answer: false },
  Matching: {
    id: 't4',
    kind: 'Matching',
    prompt: '',
    difficulty: 'easy',
    pairs: [
      { id: 'p1', left: 'L', right: 'R' },
      { id: 'p2', left: 'L2', right: 'R2' },
    ],
  },
  Ordering: {
    id: 't5',
    kind: 'Ordering',
    prompt: '',
    difficulty: 'easy',
    items: [
      { id: 'i1', text: '1' },
      { id: 'i2', text: '2' },
    ],
  },
  FillInBlank: {
    id: 't6',
    kind: 'FillInBlank',
    prompt: '',
    difficulty: 'easy',
    segments: [
      { id: 's1', text: 'Два плюс', blank: 'Два' },
      { id: 's2', text: ' конец', blank: null },
    ],
  },
  OpenAnswer: {
    id: 't7',
    kind: 'OpenAnswer',
    prompt: '',
    difficulty: 'easy',
    sampleAnswer: '4',
    placeholder: '',
  },
} satisfies Record<string, AnyTask>

describe('checkTask', () => {
  it('без ответа или с чужим типом ответа — неверно', () => {
    expect(checkTask(tasks.SingleChoice, undefined)).toBe('incorrect')
    expect(checkTask(tasks.SingleChoice, { kind: 'TrueFalse', value: true })).toBe('incorrect')
  })

  it('SingleChoice: верный выбор и пустой выбор', () => {
    expect(checkTask(tasks.SingleChoice, { kind: 'SingleChoice', choiceId: 'a' })).toBe('correct')
    expect(checkTask(tasks.SingleChoice, { kind: 'SingleChoice', choiceId: 'b' })).toBe('incorrect')
    expect(checkTask(tasks.SingleChoice, { kind: 'SingleChoice', choiceId: null })).toBe(
      'incorrect',
    )
  })

  it('MultipleChoice: точное множество, дубликаты не проходят', () => {
    expect(checkTask(tasks.MultipleChoice, { kind: 'MultipleChoice', choiceIds: ['b', 'a'] })).toBe(
      'correct',
    )
    expect(checkTask(tasks.MultipleChoice, { kind: 'MultipleChoice', choiceIds: ['a'] })).toBe(
      'incorrect',
    )
    expect(checkTask(tasks.MultipleChoice, { kind: 'MultipleChoice', choiceIds: ['a', 'a'] })).toBe(
      'incorrect',
    )
  })

  it('TrueFalse: совпадение с ответом', () => {
    expect(checkTask(tasks.TrueFalse, { kind: 'TrueFalse', value: false })).toBe('correct')
    expect(checkTask(tasks.TrueFalse, { kind: 'TrueFalse', value: true })).toBe('incorrect')
    expect(checkTask(tasks.TrueFalse, { kind: 'TrueFalse', value: null })).toBe('incorrect')
  })

  it('Matching: все пары на своих местах', () => {
    expect(checkTask(tasks.Matching, { kind: 'Matching', mapping: { p1: 'p1' } })).toBe('incorrect')
    expect(
      checkTask(tasks.Matching, { kind: 'Matching', mapping: { p1: 'p1', p2: 'p2', p3: 'p1' } }),
    ).toBe('correct')
  })

  it('Ordering: точная последовательность', () => {
    expect(checkTask(tasks.Ordering, { kind: 'Ordering', itemIds: ['i1', 'i2'] })).toBe('correct')
    expect(checkTask(tasks.Ordering, { kind: 'Ordering', itemIds: ['i2', 'i1'] })).toBe('incorrect')
    expect(checkTask(tasks.Ordering, { kind: 'Ordering', itemIds: ['i1'] })).toBe('incorrect')
  })

  it('FillInBlank: все пропуски заполнены без учёта регистра', () => {
    expect(checkTask(tasks.FillInBlank, { kind: 'FillInBlank', values: { s1: '  два ' } })).toBe(
      'correct',
    )
    expect(checkTask(tasks.FillInBlank, { kind: 'FillInBlank', values: { s1: 'три' } })).toBe(
      'incorrect',
    )
    expect(checkTask(tasks.FillInBlank, { kind: 'FillInBlank', values: {} })).toBe('incorrect')
  })

  it('OpenAnswer: всегда верно', () => {
    expect(checkTask(tasks.OpenAnswer, { kind: 'OpenAnswer', text: 'что угодно' })).toBe('correct')
  })
})
