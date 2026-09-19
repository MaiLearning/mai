import { sendUpdateResource as invokeUpdate } from '../api/update'
import type { Resource, UpdateResourceInput } from '../core/model'
import { validateResourceCourseId, validateResourceId, validateResourceName } from '../core/rules'
import { ResourceSchema, UpdateResourceInputSchema } from '../core/schema'

export async function updateResource(input: UpdateResourceInput): Promise<Resource> {
  const resourceId = validateResourceId(input.resourceId)
  const courseId = validateResourceCourseId(input.courseId)
  const name = validateResourceName(input.name)
  const request = UpdateResourceInputSchema.parse({
    resourceId,
    courseId,
    name,
    typeKey: input.typeKey ?? null,
  })
  const data = await invokeUpdate(request)

  return ResourceSchema.parse(data)
}
