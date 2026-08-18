import { invoke } from '@tauri-apps/api/core'
import type { Course } from '../core/model'
import { fakeState } from '@/utils/fake-entities-storage/state'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'

export function fetchAllCourses(): Promise<Course[]> {
  return isFakeDataEnabled ? Promise.resolve([...fakeState.courses]) : invoke<Course[]>('all_courses')
}

export function fetchCourseById(id: string): Promise<Course> {
  const course = fakeState.courses.find((item) => item.id === id)
  return isFakeDataEnabled ? (course ? Promise.resolve({ ...course }) : Promise.reject(new Error('Курс не найден'))) : invoke<Course>('get_course', { id })
}
