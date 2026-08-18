import { invoke } from '@tauri-apps/api/core'
import type { Directory } from '../core/model'

export function sendCreateDirectory(
  courseId: string,
  name: string,
  parentId?: string | null,
): Promise<Directory> {
  return invoke<Directory>('create_directory', {
    courseId,
    name,
    parentId: parentId ?? null,
  })
}
