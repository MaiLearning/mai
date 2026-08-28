import { useCallback, useState } from 'react'

/**
 * Поисковый запрос по структуре. Во время поиска дерево разворачивается
 * и фильтруется, drag-and-drop отключается (CourseTree).
 */
export function useSidebarSearch() {
  const [query, setQuery] = useState('')
  const clear = useCallback(() => setQuery(''), [])

  return { query, setQuery, clear }
}
