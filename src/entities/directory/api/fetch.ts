import { invoke } from '@tauri-apps/api/core'
import type { Directory } from '../core/model'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function fetchDirectories(courseId: string): Promise<Directory[]> {
  return isFakeDataEnabled ? Promise.resolve(fakeState.directories.filter((item) => item.courseId === courseId).map((item) => ({ ...item }))) : invoke<Directory[]>('get_directories', { courseId })
}
