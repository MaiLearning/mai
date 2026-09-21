import type { CodeRunResult, CodeStep } from '../../entity'

/**
 * Проверка результата запуска против ожиданий шага:
 * stdout совпадает с ожидаемым (trim-нормализация обеих сторон)
 * и процесс завершился сам с кодом 0.
 */
export function checkRun(step: CodeStep, run: CodeRunResult): 'passed' | 'failed' {
  if (run.timedOut) return 'failed'
  if (run.exitCode !== 0) return 'failed'

  const expected = step.expectedOutput.trim()
  const actual = run.stdout.trim()

  return expected === actual ? 'passed' : 'failed'
}
