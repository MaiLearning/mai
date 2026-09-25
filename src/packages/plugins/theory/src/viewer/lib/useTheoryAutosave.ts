import { info, error as logError } from '@mai/tauri/logs'
import type { JSONContent } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { saveTheoryContent } from '../../entity/services'
import { DEFAULT_THEORY_AUTOSAVE_DELAY } from '../../settings/autosaveDelay'

/** Минимальное время показа статуса «Сохранение…» — локальное сохранение быстрее, и статус не должен мелькать. */
const SAVE_STATE_MIN_MS = 800

/** Через сколько после «Сохранено» статус гаснет обратно в idle. */
const SAVED_DECAY_MS = 2000

/** Держит статус «Сохранение…» не меньше SAVE_STATE_MIN_MS от момента его показа. */
function holdMinSavingDuration(savingStartedAt: number): Promise<void> {
  const rest = SAVE_STATE_MIN_MS - (Date.now() - savingStartedAt)

  return rest > 0 ? new Promise((resolve) => setTimeout(resolve, rest)) : Promise.resolve()
}

interface UseTheoryAutosaveOptions {
  resourceId: string
  debounceMs?: number
  onSaved?: (content: JSONContent) => void
}

/**
 * Автосохранение контента теории: дебаунс изменений, статусы
 * idle/saving/saved/error, финальное сохранение при размонтировании.
 *
 * flushSave — единственный владелец отложенного контента: он же используется
 * дебаунсом, ручным сохранением (Ctrl+S) и финальным сохранением — гонок нет.
 */
export function useTheoryAutosave({
  resourceId,
  debounceMs = DEFAULT_THEORY_AUTOSAVE_DELAY,
  onSaved,
}: UseTheoryAutosaveOptions) {
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

  const schedulePendingSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => void flushSave(), debounceMs)
  }, [debounceMs, flushSave])

  const scheduleSave = useCallback(
    (content: JSONContent) => {
      pendingRef.current = content
      // Статус «Сохранение…» при печати во время сохранения не сбрасываем —
      // сбрасываем только «Ошибка» (следующее изменение повторяет попытку).
      if (saveState === 'error') setSaveState('idle')

      schedulePendingSave()
    },
    [saveState, schedulePendingSave],
  )

  useEffect(() => {
    if (timerRef.current) schedulePendingSave()
  }, [schedulePendingSave])

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
