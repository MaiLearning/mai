import {
  sendClearTheoryContent as invokeClear,
  sendDeleteTheoryContent as invokeDelete,
} from '../api/delete'
import type { TheoryContent } from '../core/model'
import { TheoryContentSchema } from '../core/schema'

export async function clearTheoryContent(resourceId: string): Promise<TheoryContent> {
  const data = await invokeClear(resourceId)
  return TheoryContentSchema.parse(data)
}

export async function deleteTheoryContent(resourceId: string): Promise<TheoryContent> {
  const data = await invokeDelete(resourceId)
  return TheoryContentSchema.parse(data)
}
