import { invoke } from '@tauri-apps/api/core'
import type { Directory } from '../core/model'

export function fetchDirectories(courseId: string): Promise<Directory[]> {
  return invoke<Directory[]>('get_directories', { courseId })
}
