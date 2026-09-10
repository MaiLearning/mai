import { sendRunCode as invokeRun } from '../api/run'
import type { CodeRunResult, RunCodeInput } from '../core/model'
import { CodeRunResultSchema, RunCodeInputSchema } from '../core/schema'

export async function runCode(input: RunCodeInput): Promise<CodeRunResult> {
  const request = RunCodeInputSchema.parse(input)
  const data = await invokeRun(request.language, request.code)

  return CodeRunResultSchema.parse(data)
}
