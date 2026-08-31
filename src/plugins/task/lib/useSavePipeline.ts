import { error as logError } from '@tauri-apps/plugin-log'
import { useEffect, useRef, useState } from 'react'
import { createSavePipeline, type SaveOp, type SavePipeline, type SaveState } from './save-pipeline'

export type { SaveOp, SaveState } from './save-pipeline'

/**
 * Конвейер сохранения задач (замена useAutosave): коалесция однотипных
 * операций, одна in-flight операция, UX-удержание индикатора. Статус —
 * наружу (индикатор в футере воркспейса), тостов нет; при размонтировании
 * накопленное уходит fire-and-forget.
 */
export function useSavePipeline(): { state: SaveState; enqueue: (op: SaveOp) => void } {
  const [state, setState] = useState<SaveState>('idle')
  const pipelineRef = useRef<SavePipeline | null>(null)
  if (pipelineRef.current === null) {
    pipelineRef.current = createSavePipeline((message) => logError(message))
  }

  useEffect(() => {
    const pipeline = pipelineRef.current
    if (!pipeline) return

    const unsubscribe = pipeline.subscribe(setState)

    return () => {
      unsubscribe()
      pipeline.flushPending()
    }
  }, [])

  return { state, enqueue: (op) => pipelineRef.current?.enqueue(op) }
}
