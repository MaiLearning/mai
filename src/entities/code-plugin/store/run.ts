import { atom } from 'jotai'
import type { CodeRunResult, RunCodeInput } from '../core/model'
import { runCode } from '../services/run'

/** Запуск кода ученика: action-обёртка сервиса, стейта не имеет. */
export const runCodeAtom = atom(
  null,
  async (_get, _set, input: RunCodeInput): Promise<CodeRunResult> => runCode(input),
)
