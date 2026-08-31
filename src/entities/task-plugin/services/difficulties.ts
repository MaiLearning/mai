import { sendSetTaskDifficulties as invokeSetDifficulties } from '../api/difficulties'
import type { SetTaskDifficultiesInput } from '../core/model'
import { SetTaskDifficultiesInputSchema } from '../core/schema'

export async function setTaskDifficulties(input: SetTaskDifficultiesInput): Promise<void> {
  const request = SetTaskDifficultiesInputSchema.parse(input)
  await invokeSetDifficulties(request.resourceId, request.difficulties)
}
