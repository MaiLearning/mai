import { z } from 'zod'

export const CourseStatusSchema = z.enum(['draft', 'in_progress', 'completed'])
export type CourseStatus = z.infer<typeof CourseStatusSchema>

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  topic: z.string().nullable(),
  colorFrom: z.string().nullable(),
  colorTo: z.string().nullable(),
  status: CourseStatusSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CreateCourseInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  topic: z.string().nullable().optional(),
  colorFrom: z.string().nullable().optional(),
  colorTo: z.string().nullable().optional(),
  status: CourseStatusSchema.optional(),
})
