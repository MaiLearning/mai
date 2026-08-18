import { invoke } from '@tauri-apps/api/core'
import type { Directory } from '../core/model'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeId, fakeNow, fakeState } from '@/utils/fake-entities-storage/state'

export function sendCreateDirectory(
  courseId: string,
  name: string,
  parentId?: string | null,
): Promise<Directory> {
  if (!isFakeDataEnabled) return invoke<Directory>('create_directory', {
    courseId,
    name,
    parentId: parentId ?? null,
  })
  const timestamp = fakeNow()
  const directory = { id: fakeId(), courseId, name, createdAt: timestamp, updatedAt: timestamp }
  fakeState.directories.push(directory)
  fakeState.nodes.push({ id: directory.id, courseId, parentId: parentId ?? null, position: fakeState.nodes.filter((node) => node.parentId === (parentId ?? null)).length, isDirectory: true, resource: null, directoryId: directory.id, name })
  return Promise.resolve(directory)
}
