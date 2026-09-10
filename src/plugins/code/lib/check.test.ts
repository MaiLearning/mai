import { describe, expect, it } from 'vitest'
import type { CodeRunResult, CodeStep } from '@/entities/code-plugin'
import { checkRun } from './check'

const step = (expectedOutput: string): CodeStep => ({
  id: 's1',
  title: 'Шаг',
  instructions: '',
  starterCode: '',
  expectedOutput,
})

const run = (patch: Partial<CodeRunResult>): CodeRunResult => ({
  stdout: '',
  stderr: '',
  exitCode: 0,
  timedOut: false,
  durationMs: 10,
  ...patch,
})

describe('checkRun', () => {
  it('passed: вывод совпал, exit 0', () => {
    expect(checkRun(step('Привет'), run({ stdout: 'Привет\n' }))).toBe('passed')
  })

  it('passed: trim-нормализация обеих сторон', () => {
    expect(checkRun(step('  42  '), run({ stdout: '\n42\n\n' }))).toBe('passed')
  })

  it('failed: вывод не совпал', () => {
    expect(checkRun(step('42'), run({ stdout: '43' }))).toBe('failed')
  })

  it('failed: ненулевой код выхода', () => {
    expect(checkRun(step(''), run({ exitCode: 1 }))).toBe('failed')
  })

  it('failed: таймаут при верном выводе', () => {
    expect(checkRun(step('ok'), run({ stdout: 'ok', timedOut: true, exitCode: null }))).toBe(
      'failed',
    )
  })
})
