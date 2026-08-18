import { invoke } from '@tauri-apps/api/core'
import type { Course, CreateCourseInput } from '../core/model'

export function sendCreateCourse(input: CreateCourseInput): Promise<Course> {
  return invoke<Course>('create_course', { request: input })
}
