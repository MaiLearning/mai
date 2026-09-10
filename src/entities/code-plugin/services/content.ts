import { sendUpdateCodeContent as invokeUpdateContent } from '../api/content'
import type { CodeContentData, UpdateCodeContentInput } from '../core/model'
import { CodeContentDataSchema, UpdateCodeContentInputSchema } from '../core/schema'

export async function updateCodeContent(input: UpdateCodeContentInput): Promise<CodeContentData> {
  const request = UpdateCodeContentInputSchema.parse(input)
  const data = await invokeUpdateContent(request.resourceId, request.content)

  return CodeContentDataSchema.parse(data)
}
