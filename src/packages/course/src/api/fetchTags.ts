import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { TagStat } from '../core/model'
import { fakeFetchTags } from './fake'

export function fetchTags(): Promise<TagStat[]> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeFetchTags()

  return invoke<TagStat[]>('all_tags')
}
