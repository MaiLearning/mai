import { z } from 'zod'
import { ResourceSchema } from '../../resource/core/schema'

const StructureNodeSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  parentId: z.string().nullable(),
  position: z.number(),
  isDirectory: z.boolean(),
  resource: ResourceSchema.nullable(),
  directoryId: z.string().nullable(),
  name: z.string(),
})

export const StructureSchema = z.object({
  courseId: z.string(),
  nodes: z.array(StructureNodeSchema),
})

export const StructureNodeFlatSchema = StructureNodeSchema

export const CreateStructureResourceInputSchema = z.object({
  courseId: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  typeKey: z.string().nullable(),
})

export const MoveStructureNodeInputSchema = z.object({
  nodeId: z.string(),
  newParentId: z.string().nullable(),
  position: z.number(),
})
