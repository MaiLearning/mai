import { invoke } from '@tauri-apps/api/core'
import type { Course, CreateCourseInput } from '../core/model'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeId, fakeNow, fakeState } from '@/utils/fake-entities-storage/state'

export function sendCreateCourse(input: CreateCourseInput): Promise<Course> {
  if (!isFakeDataEnabled) return invoke<Course>('create_course', { request: input })
  const timestamp = fakeNow()
  const course = { id: fakeId(), ...input, createdAt: timestamp, updatedAt: timestamp }
  fakeState.courses.push(course)
  return Promise.resolve(course)
}
