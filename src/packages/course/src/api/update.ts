import { invoke } from '@mai/tauri/ipc'
import type { Course, UpdateCourseInput } from '../core/model'

export function sendUpdateCourse(input: UpdateCourseInput): Promise<Course> {
  return invoke<Course>('update_course', { id: input.id, request: input })
}
