import type { z } from 'zod'
import type {
  CourseSchema,
  CreateCourseInputSchema,
  TagStatSchema,
  UpdateCourseInputSchema,
} from './schema'

export type Course = z.infer<typeof CourseSchema>
export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>
export type UpdateCourseInput = z.infer<typeof UpdateCourseInputSchema>
export type TagStat = z.infer<typeof TagStatSchema>
