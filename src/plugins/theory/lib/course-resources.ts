import { debug } from '@tauri-apps/plugin-log'
import { fetchStructure } from '@/entities/structure/services'

/** Ресурс курса для wiki-автокомплита и переходов. */
export interface WikiResourceItem {
  resourceId: string
  name: string
}

/** Время жизни кэша индекса ресурсов курса. */
const CACHE_TTL_MS = 15_000

let currentCourseId: string | null = null
let cache: { items: WikiResourceItem[]; fetchedAt: number } | null = null

/**
 * Фиксирует курс активного ресурса для редактора теории. Модульный контекст,
 * а не props: расширения TipTap и node-вью создаются один раз и не пересоздаются
 * при смене ресурса.
 */
export function setWikiCourse(courseId: string | null): void {
  if (currentCourseId === courseId) return

  currentCourseId = courseId
  cache = null
}

/** Курс активного ресурса (null, если редактор вне курса). */
export function getWikiCourse(): string | null {
  return currentCourseId
}

/** Ресурсы текущего курса (name + id), кэшируются на короткое время. */
export async function getCourseResources(): Promise<WikiResourceItem[]> {
  if (!currentCourseId) return []
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.items

  try {
    const nodes = await fetchStructure(currentCourseId)
    const items = nodes
      .filter((node) => !node.isDirectory && node.resource?.id)
      .map((node) => ({ resourceId: node.resource!.id, name: node.resource!.name }))

    cache = { items, fetchedAt: Date.now() }

    return items
  } catch (e) {
    debug(
      `plugins/theory: wiki resource index fetch failed: ${e instanceof Error ? e.message : String(e)}`,
    )

    return cache?.items ?? []
  }
}
