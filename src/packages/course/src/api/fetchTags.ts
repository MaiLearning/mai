import { invoke } from '@mai/tauri/ipc'
import type { TagStat } from '../core/model'

export function fetchTags(): Promise<TagStat[]> {
  return invoke<TagStat[]>('all_tags')
}
