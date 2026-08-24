import { sendCreateCourse as invokeCreate } from '../api/create'
import type { Course, CreateCourseInput } from '../core/model'
import {
  DEFAULT_COURSE_STATUS,
  validateCourseColor,
  validateCourseDescription,
  validateCourseName,
  validateCourseStatus,
  validateCourseTopic,
} from '../core/rules'
import { CourseSchema, CreateCourseInputSchema } from '../core/schema'

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const name = validateCourseName(input.name)
  const description = validateCourseDescription(input.description ?? null)
  const topic = validateCourseTopic(input.topic ?? null)
  const colorFrom = validateCourseColor(input.colorFrom ?? null)
  const colorTo = validateCourseColor(input.colorTo ?? null)
  const status = input.status ? validateCourseStatus(input.status) : DEFAULT_COURSE_STATUS
  const request = CreateCourseInputSchema.parse({ name, description, topic, colorFrom, colorTo, status })
  const data = await invokeCreate(request)
  return CourseSchema.parse(data)
}
