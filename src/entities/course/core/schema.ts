import { z } from 'zod'

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CreateCourseInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
})
