import { invoke } from '@mai/tauri/ipc'
import type { ResourceType } from '../core/model'

export function sendCreateResourceType(input: {
  key: string
  name: string
  description?: string | null
  pluginId?: string | null
  supportedExtensions: string[]
}): Promise<ResourceType> {
  return invoke<ResourceType>('create_resource_type', { request: input })
}
