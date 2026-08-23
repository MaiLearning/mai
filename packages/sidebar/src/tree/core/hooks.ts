import { info } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useSidebarDeps } from '../../SidebarProvider'
import { TreeService } from './service'
import { TreeStore } from './store'

/**
 * useTreeController — React-хук для управления деревом курса.
 *
 * Связывает TreeStore (локальное состояние) и TreeService (синхронизация с
 * backend + история действий). Предоставляет компонентам реактивное дерево
 * и набор стабильных экшенов для мутаций.
 *
 * @param courseId — ID курса, данные которого загружаются через service.load
 *
 * @returns
 * - tree       — текущий снэпшот Tree (читается через useSyncExternalStore)
 * - nodes      — плоский SidebarNode[] (производное от tree, для рендера хостом)
 * - loading    — true пока идёт первая загрузка или смена courseId
 * - error      — текст ошибки загрузки, если есть
 * - move       — переместить узел в другую папку/позицию
 * - rename     — переименовать узел
 * - remove     — удалить узел
 * - create     — создать новый узел (ресурс или папку)
 * - undo       — отменить последнее действие (backend-first)
 * - redo       — повторить отменённое действие (backend-first)
 * - canUndo    — есть что отменять (read-only на момент рендера)
 * - canRedo    — есть что повторять
 *
 * Все экшены — async, пробрасывают ошибки в компонент для тостов.
 * useCallback с [] deps гарантирует стабильность ссылок между рендерами.
 *
 * @example
 * const { tree, loading, error, move, rename, remove, undo, redo } =
 *   useTreeController(courseId)
 */
export function useTreeController(courseId: string) {
  const { api } = useSidebarDeps()
  const storeRef = useRef<TreeStore | null>(null)
  const serviceRef = useRef<TreeService | null>(null)

  if (!storeRef.current) {
    storeRef.current = new TreeStore([])
    serviceRef.current = new TreeService(storeRef.current, api)
  } else if (serviceRef.current!.api !== api) {
    // Хост передал новый экземпляр SidebarApi — перепривязываем сервис
    serviceRef.current!.api = api
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    serviceRef
      .current!.load(courseId)
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
  }, [courseId])

  // Так, а ок вообще что мы используем Sync версию? У нас же Tauri IPC в том числе
  const tree = useSyncExternalStore(
    useCallback((cb: () => void) => storeRef.current!.subscribe(cb), []),
    useCallback(() => storeRef.current!.getSnapshot(), []),
  )
  const canUndo = serviceRef.current!.canUndo
  const canRedo = serviceRef.current!.canRedo
  const nodes = useMemo(() => tree.toNodes(), [tree])
  const move = useCallback(async (id: string, newParentId: string | null, position: number) => {
    await serviceRef.current!.move(id, newParentId, position)
  }, [])
  const rename = useCallback(async (id: string, name: string) => {
    await serviceRef.current!.rename(id, name)
  }, [])
  const remove = useCallback(async (id: string) => {
    await serviceRef.current!.remove(id)
  }, [])
  const courseIdRef = useRef(courseId)
  courseIdRef.current = courseId

  const create = useCallback(async (name: string, parentId?: string | null) => {
    info(`hooks: create name=${name} parentId=${parentId}`)
    await serviceRef.current!.create(name, parentId, courseIdRef.current)
  }, [])
  const createResource = useCallback(
    async (name: string, parentId?: string | null, typeKey?: string | null) => {
      info(`hooks: createResource name=${name} parentId=${parentId} typeKey=${typeKey}`)
      await serviceRef.current!.createResource(name, parentId, courseIdRef.current, typeKey)
    },
    [],
  )
  const undo = useCallback(async () => {
    await serviceRef.current!.undo()
  }, [])
  const redo = useCallback(async () => {
    await serviceRef.current!.redo()
  }, [])

  return {
    tree,
    nodes,
    loading,
    error,
    move,
    rename,
    remove,
    create,
    createResource,
    undo,
    redo,
    canUndo,
    canRedo,
  } as const
}
