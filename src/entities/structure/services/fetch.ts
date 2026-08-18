import { z } from 'zod'
import { fetchStructure as invokeFetch } from '../api/fetch'
import type { StructureNodeFlat } from '../core/model'
import { StructureNodeFlatSchema } from '../core/schema'

export async function fetchStructure(courseId: string): Promise<StructureNodeFlat[]> {
  const data = await invokeFetch(courseId)
  return z.array(StructureNodeFlatSchema).parse(data)
}
