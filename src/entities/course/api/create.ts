import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeId, fakeNow, fakeState } from '@/utils/fake-entities-storage/state'
import type { Course, CreateCourseInput } from '../core/model'
import { DEFAULT_COURSE_STATUS } from '../core/rules'

export function sendCreateCourse(input: CreateCourseInput): Promise<Course> {
  if (!isFakeDataEnabled) return invoke<Course>('create_course', { request: input })
  const timestamp = fakeNow()
  const course: Course = {
    id: fakeId(),
    name: input.name,
    description: input.description,
    tags: input.tags ?? [],
    colorFrom: input.colorFrom ?? null,
    colorTo: input.colorTo ?? null,
    status: input.status ?? DEFAULT_COURSE_STATUS,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  fakeState.courses.push(course)

  return Promise.resolve(course)
}
