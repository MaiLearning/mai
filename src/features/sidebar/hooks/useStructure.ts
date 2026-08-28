import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import {
  canRedoAtom,
  canUndoAtom,
  loadStructureAtom,
  structureNodesAtom,
} from '@/entities/structure'
import { toCourseNodes } from '../model/convert'
import type { CourseNode } from '../model/types'

/**
 * useStructure — чтение структуры курса из entity-стора.
 *
 * Подписывается на плоскую проекцию structureNodesAtom, конвертирует её
 * в визуальную модель CourseNode[] и владеет статусом загрузки.
 * Загрузка запускается при монтировании и смене courseId.
 */
export function useStructure(courseId: string) {
  const nodes = useAtomValue(structureNodesAtom)
  const canUndo = useAtomValue(canUndoAtom)
  const canRedo = useAtomValue(canRedoAtom)
  const load = useSetAtom(loadStructureAtom)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    load(courseId)
      .then(() => {
        if (!cancelled) setLoading(false)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [courseId, load])

  const courseNodes = useMemo<CourseNode[]>(() => toCourseNodes(nodes), [nodes])

  return { courseNodes, loading, error, canUndo, canRedo }
}
