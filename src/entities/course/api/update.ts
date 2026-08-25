import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeNow, fakeState } from '@/utils/fake-entities-storage/state'
import type { Course, UpdateCourseInput } from '../core/model'

export function sendUpdateCourse(input: UpdateCourseInput): Promise<Course> {
  if (!isFakeDataEnabled) return invoke<Course>('update_course', { id: input.id, request: input })
  const index = fakeState.courses.findIndex((course) => course.id === input.id)
  if (index === -1) return Promise.reject(new Error('Курс не найден'))
  const updated: Course = {
    ...fakeState.courses[index],
    name: input.name,
    description: input.description,
    tags: input.tags,
    colorFrom: input.colorFrom,
    colorTo: input.colorTo,
    status: input.status,
    updatedAt: fakeNow(),
  }
  fakeState.courses[index] = updated

  return Promise.resolve({ ...updated })
}
