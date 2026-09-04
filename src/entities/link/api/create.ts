import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeId, fakeNow, fakeState } from '@/utils/fake-entities-storage/state'
import type { CreateLinkInput, Link } from '../core/model'

/**
 * Создание ссылки.
 *
 * Контракт совпадает с backend-командой create_link: backend генерирует
 * id, таймстампы и initial targetStatus ('ok').
 */
export function sendCreateLink(input: CreateLinkInput): Promise<Link> {
  if (!isFakeDataEnabled) return invoke<Link>('create_link', { input })

  const timestamp = fakeNow()
  const link: Link = {
    id: fakeId(),
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    target: input.target,
    ownerPluginId: input.ownerPluginId,
    title: input.title ?? null,
    description: input.description ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
    targetStatus: 'ok',
  }
  fakeState.links.push(link)

  return Promise.resolve({ ...link, target: { ...link.target } })
}
