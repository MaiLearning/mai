import { invoke } from '@mai/tauri/ipc'
import type { ResourceType } from '../core/model'

export function fetchResourceTypes(): Promise<ResourceType[]> {
  return invoke<ResourceType[]>('list_resource_types')
}
