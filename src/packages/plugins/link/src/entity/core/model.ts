import type { z } from 'zod'
import type {
  CreateLinkInputSchema,
  LinkSchema,
  LinkSourceTypeEnumSchema,
  LinkTargetSchema,
  LinkTargetStatusSchema,
  UpdateLinkInputSchema,
} from './schema'

export type Link = z.infer<typeof LinkSchema>
export type LinkTarget = z.infer<typeof LinkTargetSchema>
export type LinkSourceType = z.infer<typeof LinkSourceTypeEnumSchema>
export type LinkTargetStatus = z.infer<typeof LinkTargetStatusSchema>
export type CreateLinkInput = z.infer<typeof CreateLinkInputSchema>
export type UpdateLinkInput = z.infer<typeof UpdateLinkInputSchema>
