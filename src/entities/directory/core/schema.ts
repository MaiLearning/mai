import { z } from 'zod'

export const DirectorySchema = z.object({
  id: z.string(),
  courseId: z.string(),
  name: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CreateDirectoryInputSchema = z.object({
  courseId: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
})
