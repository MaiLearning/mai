import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'
import type { Resource } from '../core/model'

export function sendUpdateResource(input: {
  resourceId: string
  courseId: string
  name: string
  typeKey: string | null
}): Promise<Resource> {
  if (!isFakeDataEnabled) return invoke<Resource>('update_resource', input)
  const resource = fakeState.resources.find((item) => item.id === input.resourceId)
  if (!resource) return Promise.reject(new Error('Ресурс не найден'))
  Object.assign(resource, {
    courseId: input.courseId,
    name: input.name,
    typeKey: input.typeKey,
    updatedAt: Date.now(),
  })
  const node = fakeState.nodes.find((item) => item.resource?.id === resource.id)
  if (node) Object.assign(node, { name: resource.name, resource: { ...resource } })

  return Promise.resolve({ ...resource })
}
