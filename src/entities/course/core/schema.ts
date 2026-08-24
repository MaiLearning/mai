import { z } from 'zod'

export const CourseStatusSchema = z.enum(['draft', 'in_progress', 'completed'])
export type CourseStatus = z.infer<typeof CourseStatusSchema>

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  colorFrom: z.string().nullable(),
  colorTo: z.string().nullable(),
  status: CourseStatusSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CreateCourseInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()).optional(),
  colorFrom: z.string().nullable().optional(),
  colorTo: z.string().nullable().optional(),
  status: CourseStatusSchema.optional(),
})

export const UpdateCourseInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  colorFrom: z.string().nullable(),
  colorTo: z.string().nullable(),
  status: CourseStatusSchema,
})
