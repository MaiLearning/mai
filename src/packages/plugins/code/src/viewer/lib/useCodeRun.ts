import { useCallback, useRef, useState } from 'react'
import type { CodeLanguage, CodeRunResult, CodeStep, CodeStepResult } from '../../entity'
import { runCode } from '../../entity/services'
import { checkRun } from './check'

interface RunOutputState {
  output: CodeRunResult | null
  error: string | null
}

/**
 * Запуск и проверка кода шага: состояние «запускается», результат
 * и вердикт прохождения. Запуск гоняет backend `code_run` и фиксирует
 * результат шага через setStepResult.
 */
export function useCodeRun() {
  const [running, setRunning] = useState(false)
  const [runOutput, setRunOutput] = useState<RunOutputState>({ output: null, error: null })
  const runningRef = useRef(false)

  const check = useCallback(
    async (
      language: CodeLanguage,
      step: CodeStep,
      code: string,
      setStepResult: (stepId: string, result: CodeStepResult) => void,
    ) => {
      if (runningRef.current) return
      runningRef.current = true
      setRunning(true)
      setRunOutput({ output: null, error: null })
      try {
        const result = await runCode({ language, code })
        const verdict = checkRun(step, result)
        setStepResult(step.id, verdict)
        setRunOutput({ output: result, error: null })
      } catch (e) {
        setRunOutput({ output: null, error: e instanceof Error ? e.message : String(e) })
      } finally {
        runningRef.current = false
        setRunning(false)
      }
    },
    [],
  )

  /** Гасит панель результата: смена шага, правка кода, перезапуск прохождения. */
  const clearOutput = useCallback(() => {
    setRunOutput({ output: null, error: null })
  }, [])

  return { running, runOutput, check, clearOutput }
}
