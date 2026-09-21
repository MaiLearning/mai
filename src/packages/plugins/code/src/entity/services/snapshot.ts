import { fetchCodeContent as invokeSnapshot } from '../api/snapshot'
import type { CodeContentData } from '../core/model'
import { CodeContentDataSchema } from '../core/schema'

export async function fetchCodeContentSnapshot(resourceId: string): Promise<CodeContentData> {
  const data = await invokeSnapshot(resourceId)

  return CodeContentDataSchema.parse(data)
}
