import { invoke } from '@tauri-apps/api/core'
import type { Course } from '../core/model'

export function fetchAllCourses(): Promise<Course[]> {
  return invoke<Course[]>('all_courses')
}

export function fetchCourseById(id: string): Promise<Course> {
  return invoke<Course>('get_course', { id })
}
