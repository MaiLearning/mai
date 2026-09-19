import { invoke } from '@mai/tauri/ipc'
import type { Course, CreateCourseInput } from '../core/model'

export function sendCreateCourse(input: CreateCourseInput): Promise<Course> {
  return invoke<Course>('create_course', { request: input })
}
