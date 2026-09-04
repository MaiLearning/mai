import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'
import type { Link, UpdateLinkInput } from '../core/model'

export function sendUpdateLink(input: UpdateLinkInput): Promise<Link> {
  if (!isFakeDataEnabled) return invoke<Link>('update_link', { input })

  const link = fakeState.links.find((item) => item.id === input.id)
  if (!link) return Promise.reject(new Error('Ссылка не найдена'))
  if (link.ownerPluginId !== input.ownerPluginId)
    return Promise.reject(new Error('Ссылку может изменять только плагин-владелец'))
  if (input.title !== undefined) link.title = input.title
  if (input.description !== undefined) link.description = input.description
  if (input.target !== undefined) link.target = input.target
  link.updatedAt = Date.now()

  return Promise.resolve({ ...link, target: { ...link.target } })
}
