import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { Course, UpdateCourseInput } from '../core/model'
import { fakeSendUpdateCourse } from './fake'

export function sendUpdateCourse(input: UpdateCourseInput): Promise<Course> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendUpdateCourse(input)

  return invoke<Course>('update_course', { id: input.id, request: input })
}
