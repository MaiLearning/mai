import { fetchTheoryContent as invokeFetch } from '../api/fetch'
import type { TheoryContent } from '../core/model'
import { TheoryContentSchema } from '../core/schema'

export async function fetchTheoryContent(resourceId: string): Promise<TheoryContent> {
  const data = await invokeFetch(resourceId)
  return TheoryContentSchema.parse(data)
}
