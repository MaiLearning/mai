import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { Course } from '../core/model'
import { fakeFetchAllCourses, fakeFetchCourseById } from './fake'

export function fetchAllCourses(): Promise<Course[]> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeFetchAllCourses()

  return invoke<Course[]>('all_courses')
}

export function fetchCourseById(id: string): Promise<Course> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeFetchCourseById(id)

  return invoke<Course>('get_course', { id })
}
