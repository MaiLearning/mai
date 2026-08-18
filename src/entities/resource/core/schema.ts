import { z } from 'zod'

export const ResourceTypeSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  pluginId: z.string().nullable(),
  supportedExtensions: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CreateResourceTypeInputSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  pluginId: z.string().nullable(),
  supportedExtensions: z.array(z.string()),
})

export const ResourceSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  typeKey: z.string().nullable(),
  name: z.string(),
  metadata: z.unknown(),
  files: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const UpdateResourceInputSchema = z.object({
  resourceId: z.string(),
  courseId: z.string(),
  name: z.string(),
  typeKey: z.string().nullable(),
})
