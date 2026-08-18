import { sendCreateDirectory as invokeCreate } from '../api/create'
import type { CreateDirectoryInput, Directory } from '../core/model'
import { validateDirectoryCourseId, validateDirectoryName } from '../core/rules'
import { CreateDirectoryInputSchema, DirectorySchema } from '../core/schema'

export async function createDirectory(input: CreateDirectoryInput): Promise<Directory> {
  const courseId = validateDirectoryCourseId(input.courseId)
  const name = validateDirectoryName(input.name)
  const request = CreateDirectoryInputSchema.parse({
    courseId,
    name,
    parentId: input.parentId ?? null,
  })
  const data = await invokeCreate(request.courseId, request.name, request.parentId)
  return DirectorySchema.parse(data)
}
