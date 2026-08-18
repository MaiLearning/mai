import type { z } from 'zod'
import type {
  CreateResourceTypeInputSchema,
  ResourceSchema,
  ResourceTypeSchema,
  UpdateResourceInputSchema,
} from './schema'

export type ResourceType = z.infer<typeof ResourceTypeSchema>
export type Resource = z.infer<typeof ResourceSchema>
export type CreateResourceTypeInput = z.infer<typeof CreateResourceTypeInputSchema>
export type UpdateResourceInput = z.infer<typeof UpdateResourceInputSchema>
