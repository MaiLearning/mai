import { sendUpdateCourse as invokeUpdate } from '../api/update'
import type { Course, UpdateCourseInput } from '../core/model'
import {
  validateCourseColor,
  validateCourseDescription,
  validateCourseId,
  validateCourseName,
  validateCourseStatus,
  validateCourseTags,
} from '../core/rules'
import { CourseSchema, UpdateCourseInputSchema } from '../core/schema'

export async function updateCourse(input: UpdateCourseInput): Promise<Course> {
  const id = validateCourseId(input.id)
  const name = validateCourseName(input.name)
  const description = validateCourseDescription(input.description ?? null)
  const tags = validateCourseTags(input.tags ?? [])
  const colorFrom = validateCourseColor(input.colorFrom ?? null)
  const colorTo = validateCourseColor(input.colorTo ?? null)
  const status = validateCourseStatus(input.status)
  const request = UpdateCourseInputSchema.parse({
    id,
    name,
    description,
    tags,
    colorFrom,
    colorTo,
    status,
  })
  const data = await invokeUpdate(request)
  return CourseSchema.parse(data)
}
