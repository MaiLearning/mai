import { info, error as logError } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CodeLessonContent } from '@/entities/code-plugin'
import { updateCodeContent } from '@/entities/code-plugin/services'

/** Задержка дебаунса автосохранения. */
const SAVE_DEBOUNCE_MS = 500

/** Минимальное время показа статуса «Сохранение…» — статус не должен мелькать. */
const SAVE_STATE_MIN_MS = 800

/** Через сколько после «Сохранено» статус гаснет обратно в idle. */
const SAVED_DECAY_MS = 2000

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

/** Держит статус «Сохранение…» не меньше SAVE_STATE_MIN_MS от момента его показа. */
function holdMinSavingDuration(savingStartedAt: number): Promise<void> {
  const rest = SAVE_STATE_MIN_MS - (Date.now() - savingStartedAt)

  return rest > 0 ? new Promise((resolve) => setTimeout(resolve, rest)) : Promise.resolve()
}

/**
 * Автосохранение контента урока кода: контент — один opaque-блоб,
 * сохраняется целиком с дебаунсом (по образцу useTheoryAutosave).
 * flushSave — единственный владелец отложенного контента.
 */
export function useCodeAutosave(resourceId: string) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const pendingRef = useRef<CodeLessonContent | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const flushSave = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (decayRef.current) {
      clearTimeout(decayRef.current)
      decayRef.current = null
    }

    const content = pendingRef.current
    pendingRef.current = null
    if (!content) return

    setSaveState('saving')
    const savingStartedAt = Date.now()
    try {
      await updateCodeContent({ resourceId, content })
      await holdMinSavingDuration(savingStartedAt)
      if (!mountedRef.current) return

      setSaveState('saved')
      info(`Контент code-ресурса ${resourceId} сохранён`)
      decayRef.current = setTimeout(() => {
        if (mountedRef.current) setSaveState('idle')
      }, SAVED_DECAY_MS)
    } catch (e) {
      await holdMinSavingDuration(savingStartedAt)
      logError(
        `Не удалось сохранить контент code-ресурса ${resourceId}: ${e instanceof Error ? e.message : String(e)}`,
      )
      if (!mountedRef.current) return

      setSaveState('error')
      // Возвращаем контент в очередь — следующее изменение повторит попытку.
      pendingRef.current = content
    }
  }, [resourceId])

  const scheduleSave = useCallback(
    (content: CodeLessonContent) => {
      pendingRef.current = content
      if (saveState === 'error') setSaveState('idle')

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => void flushSave(), SAVE_DEBOUNCE_MS)
    },
    [flushSave, saveState],
  )

  // Финальное сохранение при размонтировании / смене ресурса — тем же flushSave.
  const flushRef = useRef(flushSave)
  flushRef.current = flushSave

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      void flushRef.current()
    }
  }, [resourceId])

  return { saveState, scheduleSave, flushSave }
}
