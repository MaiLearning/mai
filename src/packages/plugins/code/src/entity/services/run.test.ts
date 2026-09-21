import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendRunCode } from '../api/run'
import type { CodeRunResult } from '../core/model'
import { runCode } from './run'

vi.mock('../api/run', () => ({ sendRunCode: vi.fn() }))

const invokeRun = vi.mocked(sendRunCode)

const result: CodeRunResult = {
  stdout: 'hello\n',
  stderr: '',
  exitCode: 0,
  timedOut: false,
  durationMs: 12,
}

describe('code run service', () => {
  beforeEach(() => invokeRun.mockReset())

  it('валидирует вход и результат backend', async () => {
    invokeRun.mockResolvedValue(result)

    await expect(runCode({ language: 'python', code: 'print("hello")' })).resolves.toEqual(result)
    expect(invokeRun).toHaveBeenCalledWith('python', 'print("hello")')
  })

  it('валидирует результат с null-кодом завершения', async () => {
    invokeRun.mockResolvedValue({ ...result, stdout: '', exitCode: null, timedOut: true })

    await expect(runCode({ language: 'javascript', code: '' })).resolves.toMatchObject({
      exitCode: null,
      timedOut: true,
    })
  })

  it('отклоняет неизвестный язык без вызова API', async () => {
    await expect(runCode({ language: 'ruby' as 'python', code: '' })).rejects.toThrow()
    expect(invokeRun).not.toHaveBeenCalled()
  })

  it('отклоняет битый ответ backend', async () => {
    invokeRun.mockResolvedValue({ stdout: 'ok' } as unknown as CodeRunResult)

    await expect(runCode({ language: 'python', code: 'print(1)' })).rejects.toThrow()
  })
})
