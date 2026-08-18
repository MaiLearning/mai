import { invoke } from '@tauri-apps/api/core'
import type { ResourceType } from '../core/model'

export function fetchResourceTypes(): Promise<ResourceType[]> {
  return invoke<ResourceType[]>('list_resource_types')
}
