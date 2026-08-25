import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'
import type { TagStat } from '../core/model'

export function fetchTags(): Promise<TagStat[]> {
  if (!isFakeDataEnabled) return invoke<TagStat[]>('all_tags')

  const counts = new Map<string, number>()
  for (const course of fakeState.courses) {
    for (const tag of course.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const stats = [...counts.entries()].map(([name, count]) => ({ name, count }))
  stats.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  return Promise.resolve(stats)
}
