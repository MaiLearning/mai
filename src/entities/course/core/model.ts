import type { z } from 'zod'
import type { CourseSchema, CreateCourseInputSchema } from './schema'

export type Course = z.infer<typeof CourseSchema>
export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>
