import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sendListTaskAttempts,
  sendRestartTask,
  sendSetTaskResult,
  sendSubmitTaskAnswer,
} from '../api/progress'
import type { TaskAttempt } from '../core/model'
import { listTaskAttempts, restartTask, setTaskResult, submitTaskAnswer } from './progress'

vi.mock('../api/progress', () => ({
  sendSubmitTaskAnswer: vi.fn(),
  sendSetTaskResult: vi.fn(),
  sendRestartTask: vi.fn(),
  sendListTaskAttempts: vi.fn(),
}))

const invokeSubmitAnswer = vi.mocked(sendSubmitTaskAnswer)
const invokeSetResult = vi.mocked(sendSetTaskResult)
const invokeRestart = vi.mocked(sendRestartTask)
const invokeListAttempts = vi.mocked(sendListTaskAttempts)

describe('task progress services', () => {
  beforeEach(() => {
    invokeSubmitAnswer.mockReset()
    invokeSetResult.mockReset()
    invokeRestart.mockReset()
    invokeListAttempts.mockReset()
  })

  it('submitTaskAnswer валидирует вход и уходит в API', async () => {
    const answer = { kind: 'TrueFalse', value: false } as const

    await submitTaskAnswer({ taskId: 't1', answer })

    expect(invokeSubmitAnswer).toHaveBeenCalledWith('t1', answer)
  })

  it('setTaskResult пропускает null-ответ (снапшот попытки)', async () => {
    await setTaskResult({ taskId: 't1', answer: null, result: 'correct' })

    expect(invokeSetResult).toHaveBeenCalledWith('t1', null, 'correct')
  })

  it('setTaskResult валидирует результат', async () => {
    await expect(
      setTaskResult({ taskId: 't1', answer: null, result: 'so-so' as 'correct' }),
    ).rejects.toThrow()
    expect(invokeSetResult).not.toHaveBeenCalled()
  })

  it('restartTask валидирует вход и уходит в API', async () => {
    await restartTask({ taskId: 't1' })

    expect(invokeRestart).toHaveBeenCalledWith('t1')
  })

  it('listTaskAttempts валидирует массив попыток', async () => {
    const attempt: TaskAttempt = {
      id: 'a1',
      taskId: 't1',
      seq: 1,
      answer: { kind: 'TrueFalse', value: true },
      result: 'correct',
      checkedAt: 100,
    }
    invokeListAttempts.mockResolvedValue([attempt])

    await expect(listTaskAttempts({ taskId: 't1' })).resolves.toEqual([attempt])
  })

  it('listTaskAttempts допускает null-ответ в попытке', async () => {
    invokeListAttempts.mockResolvedValue([
      { id: 'a1', taskId: 't1', seq: 1, answer: null, result: 'incorrect', checkedAt: 100 },
    ])

    await expect(listTaskAttempts({ taskId: 't1' })).resolves.toHaveLength(1)
  })

  it('listTaskAttempts отклоняет битую попытку', async () => {
    invokeListAttempts.mockResolvedValue([{ id: 'a1' }] as unknown as TaskAttempt[])

    await expect(listTaskAttempts({ taskId: 't1' })).rejects.toThrow()
  })
})
