import { invoke } from '@mai/tauri/ipc'

export function sendDeleteCourse(id: string): Promise<void> {
  return invoke('delete_course', { id })
}
