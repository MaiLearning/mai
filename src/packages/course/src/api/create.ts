import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { Course, CreateCourseInput } from '../core/model'
import { fakeSendCreateCourse } from './fake'

export function sendCreateCourse(input: CreateCourseInput): Promise<Course> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendCreateCourse(input)

  return invoke<Course>('create_course', { request: input })
}
