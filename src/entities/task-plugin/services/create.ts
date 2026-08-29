import { sendSaveTaskContent as invokeSave } from '../api/create'
import type { SaveTaskContentInput, TaskContentData } from '../core/model'
import { SaveTaskContentInputSchema, TaskContentDataSchema } from '../core/schema'

export async function saveTaskContent(input: SaveTaskContentInput): Promise<TaskContentData> {
  const request = SaveTaskContentInputSchema.parse({
    resourceId: input.resourceId,
    content: input.content,
  })
  const data = await invokeSave(request.resourceId, request.content)

  return TaskContentDataSchema.parse(data)
}
