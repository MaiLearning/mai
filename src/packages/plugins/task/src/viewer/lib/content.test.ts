import { describe, expect, it } from 'vitest'
import type { AnyTask, TaskContent } from '../core/types'
import { withRestart, withResult, withTaskDeleted, withTaskEdited } from './content'

const content: TaskContent = {
  tasks: [
    { id: 't1', prompt: '1', difficulty: 'easy', kind: 'TrueFalse', answer: true },
    { id: 't2', prompt: '2', difficulty: 'easy', kind: 'TrueFalse', answer: false },
  ],
  difficulties: [],
  answers: { t2: { kind: 'TrueFalse', value: true } },
  results: { t2: 'correct' },
  completed: { t2: true },
}

describe('withResult', () => {
  it('ставит результат и факт прохождения', () => {
    const next = withResult(content, 't1', 'incorrect')

    expect(next.results.t1).toBe('incorrect')
    expect(next.completed.t1).toBe(true)
    expect(next.results.t2).toBe('correct')
  })
})

describe('withRestart', () => {
  it('стирает ответ и результат — задача снова «не решалась»; факт прохождения остаётся', () => {
    const next = withRestart(content, 't2')

    expect(next.answers.t2).toBeUndefined()
    expect(next.results.t2).toBeUndefined()
    expect(next.completed.t2).toBe(true)
    expect(next.tasks).toEqual(content.tasks)
  })
})

describe('withTaskEdited', () => {
  const next: AnyTask = { ...content.tasks[1], prompt: 'обновлён' }

  it('заменяет задачу и полностью сбрасывает её прогресс', () => {
    const updated = withTaskEdited(content, 't2', next)

    expect(updated.tasks[1].prompt).toBe('обновлён')
    expect(updated.answers.t2).toBeUndefined()
    expect(updated.results.t2).toBeUndefined()
    expect(updated.completed.t2).toBeUndefined()
  })

  it('не задевает прогресс других задач', () => {
    const updated = withTaskEdited(withResult(content, 't1', 'correct'), 't2', next)

    expect(updated.results.t1).toBe('correct')
    expect(updated.completed.t1).toBe(true)
  })
})

describe('withTaskDeleted', () => {
  it('убирает задачу вместе с её ответом, результатом и флагом прохождения', () => {
    const next = withTaskDeleted(content, 't2')

    expect(next.tasks).toEqual([content.tasks[0]])
    expect(next.answers.t2).toBeUndefined()
    expect(next.results.t2).toBeUndefined()
    expect(next.completed.t2).toBeUndefined()
  })

  it('не задевает другие задачи и их прогресс', () => {
    const next = withTaskDeleted(withResult(content, 't1', 'correct'), 't2')

    expect(next.tasks).toHaveLength(1)
    expect(next.results.t1).toBe('correct')
    expect(next.completed.t1).toBe(true)
  })
})
