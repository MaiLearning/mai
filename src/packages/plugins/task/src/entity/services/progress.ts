import { z } from 'zod'
import {
  sendListTaskAttempts as invokeListAttempts,
  sendRestartTask as invokeRestart,
  sendSetTaskResult as invokeSetResult,
  sendSubmitTaskAnswer as invokeSubmitAnswer,
} from '../api/progress'
import type {
  ListTaskAttemptsInput,
  RestartTaskInput,
  SetTaskResultInput,
  SubmitTaskAnswerInput,
  TaskAttempt,
} from '../core/model'
import {
  ListTaskAttemptsInputSchema,
  RestartTaskInputSchema,
  SetTaskResultInputSchema,
  SubmitTaskAnswerInputSchema,
  TaskAttemptSchema,
} from '../core/schema'

export async function submitTaskAnswer(input: SubmitTaskAnswerInput): Promise<void> {
  const request = SubmitTaskAnswerInputSchema.parse(input)
  await invokeSubmitAnswer(request.taskId, request.answer)
}

export async function setTaskResult(input: SetTaskResultInput): Promise<void> {
  const request = SetTaskResultInputSchema.parse(input)
  await invokeSetResult(request.taskId, request.answer, request.result)
}

export async function restartTask(input: RestartTaskInput): Promise<void> {
  const request = RestartTaskInputSchema.parse(input)
  await invokeRestart(request.taskId)
}

export async function listTaskAttempts(input: ListTaskAttemptsInput): Promise<TaskAttempt[]> {
  const request = ListTaskAttemptsInputSchema.parse(input)
  const attempts = await invokeListAttempts(request.taskId)

  return z.array(TaskAttemptSchema).parse(attempts)
}
