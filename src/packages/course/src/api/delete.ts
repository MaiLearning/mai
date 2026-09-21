import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import { fakeSendDeleteCourse } from './fake'

export function sendDeleteCourse(id: string): Promise<void> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendDeleteCourse(id)

  return invoke('delete_course', { id })
}
