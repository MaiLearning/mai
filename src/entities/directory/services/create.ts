import type { StructureNodeFlat } from '@/entities/structure/core/model'
import { StructureNodeFlatSchema } from '@/entities/structure/core/schema'
import { sendCreateDirectory as invokeCreate } from '../api/create'
import type { CreateDirectoryInput } from '../core/model'
import { validateDirectoryCourseId, validateDirectoryName } from '../core/rules'
import { CreateDirectoryInputSchema } from '../core/schema'

/**
 * createDirectory — создание директории.
 *
 * Контракт ответа backend — StructureNodeFlat (плоский узел дерева),
 * аналогично createResourceInStructure. Метки времени остаются в БД
 * и не проходят через эту команду.
 */
export async function createDirectory(input: CreateDirectoryInput): Promise<StructureNodeFlat> {
  const courseId = validateDirectoryCourseId(input.courseId)
  const name = validateDirectoryName(input.name)
  const request = CreateDirectoryInputSchema.parse({
    courseId,
    name,
    parentId: input.parentId ?? null,
  })
  const data = await invokeCreate(request.courseId, request.name, request.parentId)

  return StructureNodeFlatSchema.parse(data)
}
