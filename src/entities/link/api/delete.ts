import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function sendDeleteLink(id: string, ownerPluginId: string): Promise<void> {
  if (!isFakeDataEnabled) return invoke('delete_link', { id, ownerPluginId })

  const link = fakeState.links.find((item) => item.id === id)
  if (!link) return Promise.reject(new Error('Ссылка не найдена'))
  if (link.ownerPluginId !== ownerPluginId)
    return Promise.reject(new Error('Ссылку может удалять только плагин-владелец'))
  fakeState.links = fakeState.links.filter((item) => item.id !== id)

  return Promise.resolve()
}
