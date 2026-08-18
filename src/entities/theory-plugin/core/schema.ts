import { z } from 'zod'

export const TheoryContentSchema = z.object({
  resourceId: z.string(),
  content: z.record(z.string(), z.unknown()),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const SaveTheoryContentInputSchema = z.object({
  resourceId: z.string(),
  content: z.record(z.string(), z.unknown()),
})
