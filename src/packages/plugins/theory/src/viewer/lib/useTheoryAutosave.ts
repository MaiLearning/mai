import { info, error as logError } from '@mai/tauri/logs'
import type { JSONContent } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { saveTheoryContent } from '../../entity/services'

/** Задержка дебаунса автосохранения. */
const SAVE_DEBOUNCE_MS = 500

/** Минимальное время показа статуса «Сохранение…» — локальное сохранение быстрее, и статус не должен мелькать. */
const SAVE_STATE_MIN_MS = 800

/** Через сколько после «Сохранено» статус гаснет обратно в idle. */
const SAVED_DECAY_MS = 2000

/** Держит статус «Сохранение…» не меньше SAVE_STATE_MIN_MS от момента его показа. */
function holdMinSavingDuration(savingStartedAt: number): Promise<void> {
  const rest = SAVE_STATE_MIN_MS - (Date.now() - savingStartedAt)

  return rest > 0 ? new Promise((resolve) => setTimeout(resolve, rest)) : Promise.resolve()
}

/**
 * Автосохранение контента теории: дебаунс изменений, статусы
 * idle/saving/saved/error, финальное сохранение при размонтировании.
 *
 * flushSave — единственный владелец отложенного контента: он же используется
 * дебаунсом, ручным сохранением (Ctrl+S) и финальным сохранением — гонок нет.
 */
export function useTheoryAutosave(resourceId: string, onSaved?: (content: JSONContent) => void) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const pendingRef = useRef<JSONContent | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)
  const onSavedRef = useRef(onSaved)
  onSavedRef.current = onSaved

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
      const record = await saveTheoryContent({ resourceId, content })
      await holdMinSavingDuration(savingStartedAt)
      if (!mountedRef.current) return

      setSaveState('saved')
      setUpdatedAt(record.updatedAt)
      onSavedRef.current?.(content)
      info(`plugins/theory: autosave success (${resourceId})`)
      decayRef.current = setTimeout(() => {
        if (mountedRef.current) setSaveState('idle')
      }, SAVED_DECAY_MS)
    } catch (e) {
      await holdMinSavingDuration(savingStartedAt)
      logError(`plugins/theory: save content failed: ${e instanceof Error ? e.message : String(e)}`)
      if (!mountedRef.current) return

      setSaveState('error')
      // Возвращаем контент в очередь — следующее изменение или Ctrl+S повторят попытку.
      pendingRef.current = content
    }
  }, [resourceId])

  const scheduleSave = useCallback(
    (content: JSONContent) => {
      pendingRef.current = content
      // Статус «Сохранение…» при печати во время сохранения не сбрасываем —
      // сбрасываем только «Ошибка» (следующее изменение повторяет попытку).
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

  return { saveState, updatedAt, setUpdatedAt, scheduleSave, flushSave }
}
