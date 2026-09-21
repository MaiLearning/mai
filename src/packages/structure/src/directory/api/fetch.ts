import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { Directory } from '../core/model'
import { fakeFetchDirectories } from './fake'

export function fetchDirectories(courseId: string): Promise<Directory[]> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeFetchDirectories(courseId)

  return invoke<Directory[]>('get_directories', { courseId })
}
