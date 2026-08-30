import { describe, expect, it } from 'vitest'
import {
  CustomDifficultySchema,
  SaveTaskContentInputSchema,
  TaskContentDataSchema,
  TaskContentSchema,
  TaskSchema,
} from './schema'

const base = { id: 't1', prompt: 'Вопрос?', difficulty: 'easy' }

const samples = [
  { ...base, kind: 'SingleChoice' as const, choices: [{ id: 'a', text: 'A', correct: true }] },
  { ...base, kind: 'MultipleChoice' as const, choices: [{ id: 'a', text: 'A', correct: false }] },
  { ...base, kind: 'TrueFalse' as const, answer: true },
  { ...base, kind: 'Matching' as const, pairs: [{ id: 'p1', left: 'L', right: 'R' }] },
  { ...base, kind: 'Ordering' as const, items: [{ id: 'i1', text: 'Первый' }] },
  {
    ...base,
    kind: 'FillInBlank' as const,
    segments: [{ id: 's1', text: 'Два плюс', blank: 'два' }],
  },
  { ...base, kind: 'OpenAnswer' as const, sampleAnswer: '4', placeholder: 'Ответ' },
]

describe('task content schema', () => {
  it('парсит пустой контент backend-дефолта {} в пустые списки', () => {
    const parsed = TaskContentSchema.parse({})

    expect(parsed).toEqual({ tasks: [], difficulties: [] })
  })

  it.each(samples.map((task) => [task.kind, task] as const))(
    'валидирует задачу %s',
    (_kind, task) => {
      expect(TaskSchema.parse(task)).toEqual(task)
    },
  )

  it('валидирует задачу со своей сложностью (произвольный id)', () => {
    const task = { ...base, difficulty: 'd-1', kind: 'TrueFalse' as const, answer: false }

    expect(TaskSchema.parse(task)).toEqual(task)
  })

  it('валидирует свою сложность', () => {
    const difficulty = { id: 'd-1', label: 'Дьявольская', color: '#ff0044' }

    expect(CustomDifficultySchema.parse(difficulty)).toEqual(difficulty)
  })

  it('отвергает неизвестный тип задачи', () => {
    expect(() => TaskSchema.parse({ ...base, kind: 'Puzzle', choices: [] })).toThrow()
  })

  it('валидирует полный контент ресурса со своими сложностями', () => {
    const data = {
      resourceId: 'r1',
      content: {
        tasks: [samples[0]],
        difficulties: [{ id: 'd-1', label: 'Дьявольская', color: '#ff0044' }],
      },
      createdAt: 1,
      updatedAt: 2,
    }

    expect(TaskContentDataSchema.parse(data)).toEqual(data)
  })

  it('валидирует вход сохранения: difficulties разворачиваются дефолтом', () => {
    const input = { resourceId: 'r1', content: { tasks: [samples[2]] } }

    expect(SaveTaskContentInputSchema.parse(input)).toEqual({
      ...input,
      content: { ...input.content, difficulties: [] },
    })
  })
})
