import { sendSaveTheoryContent as invokeSave } from '../api/create'
import type { SaveTheoryContentInput, TheoryContent } from '../core/model'
import { SaveTheoryContentInputSchema, TheoryContentSchema } from '../core/schema'

export async function saveTheoryContent(input: SaveTheoryContentInput): Promise<TheoryContent> {
  const request = SaveTheoryContentInputSchema.parse({
    resourceId: input.resourceId,
    content: input.content,
  })
  const data = await invokeSave(request.resourceId, request.content)

  return TheoryContentSchema.parse(data)
}
