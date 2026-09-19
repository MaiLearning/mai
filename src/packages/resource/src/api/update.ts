import { invoke } from '@mai/tauri/ipc'
import type { Resource } from '../core/model'

export function sendUpdateResource(input: {
  resourceId: string
  courseId: string
  name: string
  typeKey: string | null
}): Promise<Resource> {
  return invoke<Resource>('update_resource', input)
}
