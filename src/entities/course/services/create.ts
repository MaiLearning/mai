import { sendCreateCourse as invokeCreate } from '../api/create'
import type { Course, CreateCourseInput } from '../core/model'
import { validateCourseDescription, validateCourseName } from '../core/rules'
import { CourseSchema, CreateCourseInputSchema } from '../core/schema'

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const name = validateCourseName(input.name)
  const description = validateCourseDescription(input.description ?? null)
  const request = CreateCourseInputSchema.parse({ name, description })
  const data = await invokeCreate(request)
  return CourseSchema.parse(data)
}
