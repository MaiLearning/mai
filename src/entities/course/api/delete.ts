import { invoke } from '@tauri-apps/api/core'

export function sendDeleteCourse(id: string): Promise<void> {
  return invoke('delete_course', { id })
}
