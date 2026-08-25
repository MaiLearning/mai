import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function sendDeleteCourse(id: string): Promise<void> {
  if (!isFakeDataEnabled) return invoke('delete_course', { id })
  fakeState.courses = fakeState.courses.filter((course) => course.id !== id)
  fakeState.directories = fakeState.directories.filter((directory) => directory.courseId !== id)
  fakeState.resources = fakeState.resources.filter((resource) => resource.courseId !== id)
  fakeState.nodes = fakeState.nodes.filter((node) => node.courseId !== id)

  return Promise.resolve()
}
