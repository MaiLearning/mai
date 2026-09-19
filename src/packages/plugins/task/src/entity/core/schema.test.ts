import { describe, expect, it } from 'vitest'
import {
  CreateTaskInputSchema,
  CustomDifficultySchema,
  DeleteTaskInputSchema,
  ListTaskAttemptsInputSchema,
  RestartTaskInputSchema,
  SetTaskDifficultiesInputSchema,
  SetTaskResultInputSchema,
  SubmitTaskAnswerInputSchema,
  TaskAnswerSchema,
  TaskAttemptSchema,
  TaskContentSchema,
  TaskSchema,
  TaskSnapshotDataSchema,
  UpdateTaskContentInputSchema,
  UpdateTaskDifficultyInputSchema,
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
  it('парсит пустой контент backend-дефолта {} в пустые списки и словари', () => {
    const parsed = TaskContentSchema.parse({})

    expect(parsed).toEqual({ tasks: [], difficulties: [], answers: {}, results: {}, completed: {} })
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

  it('валидирует снапшот ресурса со своими сложностями', () => {
    const data = {
      resourceId: 'r1',
      content: {
        tasks: [samples[0]],
        difficulties: [{ id: 'd-1', label: 'Дьявольская', color: '#ff0044' }],
        answers: {},
        results: {},
        completed: { t1: true },
      },
      createdAt: 1,
      updatedAt: 2,
    }

    expect(TaskSnapshotDataSchema.parse(data)).toEqual(data)
  })

  it.each([
    [{ kind: 'SingleChoice', choiceId: 'a' }],
    [{ kind: 'SingleChoice', choiceId: null }],
    [{ kind: 'MultipleChoice', choiceIds: ['a', 'b'] }],
    [{ kind: 'MultipleChoice', choiceIds: [] }],
    [{ kind: 'TrueFalse', value: false }],
    [{ kind: 'TrueFalse', value: null }],
    [{ kind: 'Matching', mapping: { p1: 'p2' } }],
    [{ kind: 'Ordering', itemIds: ['i2', 'i1'] }],
    [{ kind: 'FillInBlank', values: { s1: 'два' } }],
    [{ kind: 'OpenAnswer', text: 'Мой ответ' }],
  ] as const)('валидирует ответ %j', (answer) => {
    expect(TaskAnswerSchema.parse(answer)).toEqual(answer)
  })

  it('отвергает ответ, подмешанный не под свой тип', () => {
    expect(() => TaskAnswerSchema.parse({ kind: 'SingleChoice', text: 'алярм' })).toThrow()
  })

  it('валидирует контент с ответами и результатами', () => {
    const data = {
      resourceId: 'r1',
      content: {
        tasks: [samples[0]],
        answers: { t1: { kind: 'SingleChoice', choiceId: 'a' } },
        results: { t1: 'correct' },
        completed: { t1: true },
        difficulties: [],
      },
      createdAt: 1,
      updatedAt: 2,
    }

    expect(TaskSnapshotDataSchema.parse(data)).toEqual(data)
  })
})

describe('task attempt schema', () => {
  it('валидирует попытку с ответом', () => {
    const attempt = {
      id: 'a1',
      taskId: 't1',
      seq: 1,
      answer: { kind: 'TrueFalse', value: true },
      result: 'correct',
      checkedAt: 100,
    }

    expect(TaskAttemptSchema.parse(attempt)).toEqual(attempt)
  })

  it('валидирует попытку с null-ответом', () => {
    const attempt = {
      id: 'a1',
      taskId: 't1',
      seq: 2,
      answer: null,
      result: 'incorrect',
      checkedAt: 200,
    }

    expect(TaskAttemptSchema.parse(attempt)).toEqual(attempt)
  })

  it('отвергает попытку без seq', () => {
    expect(() =>
      TaskAttemptSchema.parse({ id: 'a1', taskId: 't1', result: 'correct', checkedAt: 1 }),
    ).toThrow()
  })
})

describe('командные входные схемы', () => {
  it('CreateTaskInputSchema валидирует ресурс и тип', () => {
    expect(CreateTaskInputSchema.parse({ resourceId: 'r1', kind: 'TrueFalse' })).toEqual({
      resourceId: 'r1',
      kind: 'TrueFalse',
    })
    expect(() => CreateTaskInputSchema.parse({ resourceId: 'r1', kind: 'Puzzle' })).toThrow()
  })

  it('UpdateTaskContentInputSchema требует валидную задачу', () => {
    expect(UpdateTaskContentInputSchema.parse({ taskId: 't1', task: samples[0] })).toEqual({
      taskId: 't1',
      task: samples[0],
    })
    expect(() =>
      UpdateTaskContentInputSchema.parse({ taskId: 't1', task: { kind: 'TrueFalse' } }),
    ).toThrow()
  })

  it('UpdateTaskDifficultyInputSchema валидирует id и сложность', () => {
    expect(UpdateTaskDifficultyInputSchema.parse({ taskId: 't1', difficulty: 'medium' })).toEqual({
      taskId: 't1',
      difficulty: 'medium',
    })
    expect(() => UpdateTaskDifficultyInputSchema.parse({ taskId: 't1' })).toThrow()
  })

  it('DeleteTaskInputSchema и ListTaskAttemptsInputSchema требуют id задачи', () => {
    expect(DeleteTaskInputSchema.parse({ taskId: 't1' })).toEqual({ taskId: 't1' })
    expect(ListTaskAttemptsInputSchema.parse({ taskId: 't1' })).toEqual({ taskId: 't1' })
    expect(() => DeleteTaskInputSchema.parse({})).toThrow()
    expect(() => ListTaskAttemptsInputSchema.parse({ taskId: 1 })).toThrow()
  })

  it('SubmitTaskAnswerInputSchema валидирует union-ответ', () => {
    const input = { taskId: 't1', answer: { kind: 'Ordering', itemIds: ['i1'] } }

    expect(SubmitTaskAnswerInputSchema.parse(input)).toEqual(input)
  })

  it('SetTaskResultInputSchema допускает null-ответ и отвергает чужой исход', () => {
    expect(
      SetTaskResultInputSchema.parse({ taskId: 't1', answer: null, result: 'correct' }),
    ).toEqual({
      taskId: 't1',
      answer: null,
      result: 'correct',
    })
    expect(() =>
      SetTaskResultInputSchema.parse({ taskId: 't1', answer: null, result: 'maybe' }),
    ).toThrow()
  })

  it('RestartTaskInputSchema требует только id задачи', () => {
    expect(RestartTaskInputSchema.parse({ taskId: 't1' })).toEqual({ taskId: 't1' })
    expect(() => RestartTaskInputSchema.parse({})).toThrow()
  })

  it('SetTaskDifficultiesInputSchema валидирует список сложностей', () => {
    const input = {
      resourceId: 'r1',
      difficulties: [{ id: 'd-1', label: 'Дьявольская', color: '#ff0044' }],
    }

    expect(SetTaskDifficultiesInputSchema.parse(input)).toEqual(input)
    expect(() => SetTaskDifficultiesInputSchema.parse({ resourceId: 'r1' })).toThrow()
  })
})
