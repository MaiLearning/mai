import { sendCreateResource as invokeCreate } from '../api/create'
import type { CreateStructureResourceInput, StructureNodeFlat } from '../core/model'
import {
  validateCourseId as validateStructureCourseId,
  validateStructureResourceName,
} from '../core/rules'
import { CreateStructureResourceInputSchema, StructureNodeFlatSchema } from '../core/schema'

export async function createResourceInStructure(
  input: CreateStructureResourceInput,
): Promise<StructureNodeFlat> {
  const courseId = validateStructureCourseId(input.courseId)
  const name = validateStructureResourceName(input.name)
  const request = CreateStructureResourceInputSchema.parse({
    courseId,
    name,
    parentId: input.parentId ?? null,
    typeKey: input.typeKey ?? null,
  })
  const data = await invokeCreate(request.courseId, request.name, request.parentId, request.typeKey)

  return StructureNodeFlatSchema.parse(data)
}
