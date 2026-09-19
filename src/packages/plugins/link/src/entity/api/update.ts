import { invoke } from '@mai/tauri/ipc'
import type { Link, UpdateLinkInput } from '../core/model'

export function sendUpdateLink(input: UpdateLinkInput): Promise<Link> {
  return invoke<Link>('update_link', { input })
}
