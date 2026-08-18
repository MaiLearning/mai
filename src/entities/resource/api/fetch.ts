import { invoke } from '@tauri-apps/api/core'
import type { ResourceType } from '../core/model'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function fetchResourceTypes(): Promise<ResourceType[]> {
  return isFakeDataEnabled ? Promise.resolve(fakeState.resourceTypes.map((item) => ({ ...item, supportedExtensions: [...item.supportedExtensions] }))) : invoke<ResourceType[]>('list_resource_types')
}
