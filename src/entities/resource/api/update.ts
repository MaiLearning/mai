import { invoke } from '@tauri-apps/api/core'
import type { Resource } from '../core/model'

export function sendUpdateResource(input: {
  resourceId: string
  courseId: string
  name: string
  typeKey: string | null
}): Promise<Resource> {
  return invoke<Resource>('update_resource', input)
}
