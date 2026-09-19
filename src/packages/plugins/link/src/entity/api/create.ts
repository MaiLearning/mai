import { invoke } from '@mai/tauri/ipc'
import type { CreateLinkInput, Link } from '../core/model'

/**
 * Создание ссылки.
 *
 * Контракт совпадает с backend-командой create_link: backend генерирует
 * id, таймстампы и initial targetStatus ('ok').
 */
export function sendCreateLink(input: CreateLinkInput): Promise<Link> {
  return invoke<Link>('create_link', { input })
}
