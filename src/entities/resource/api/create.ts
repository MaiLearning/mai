import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeNow, fakeState } from '@/utils/fake-entities-storage/state'
import type { ResourceType } from '../core/model'

export function sendCreateResourceType(input: {
  key: string
  name: string
  description?: string | null
  pluginId?: string | null
  supportedExtensions: string[]
}): Promise<ResourceType> {
  if (!isFakeDataEnabled) return invoke<ResourceType>('create_resource_type', { request: input })
  const timestamp = fakeNow()
  const resourceType = {
    ...input,
    description: input.description ?? null,
    pluginId: input.pluginId ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  fakeState.resourceTypes.push(resourceType)

  return Promise.resolve(resourceType)
}
