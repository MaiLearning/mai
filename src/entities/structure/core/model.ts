import type { z } from 'zod'
import type {
  CreateStructureResourceInputSchema,
  MoveStructureNodeInputSchema,
  StructureNodeFlatSchema,
  StructureSchema,
} from './schema'

export type StructureNode = z.infer<typeof StructureNodeFlatSchema>
export type Structure = z.infer<typeof StructureSchema>
export type StructureNodeFlat = StructureNode
export type CreateStructureResourceInput = z.infer<typeof CreateStructureResourceInputSchema>
export type MoveStructureNodeInput = z.infer<typeof MoveStructureNodeInputSchema>
