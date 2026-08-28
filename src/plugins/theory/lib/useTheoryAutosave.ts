import { info, error as logError } from '@tauri-apps/plugin-log'
import type { JSONContent } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { saveTheoryContent } from '@/entities/theory-plugin/services'

/** Задержка дебаунса автосохранения. */
const SAVE_DEBOUNCE_MS = 500

/** Минимальное время показа статуса «Сохранение…» — локальное сохранение быстрее, и статус не должен мелькать. */
const SAVE_STATE_MIN_MS = 800

/** Держит статус «Сохранение…» не меньше SAVE_STATE_MIN_MS от момента его показа. */
function holdMinSavingDuration(savingStartedAt: number): Promise<void> {
  const rest = SAVE_STATE_MIN_MS - (Date.now() - savingStartedAt)

  return rest > 0 ? new Promise((resolve) => setTimeout(resolve, rest)) : Promise.resolve()
}

/**
 * Автосохранение контента теории: дебаунс изменений, статусы
 * idle/saving/saved/error, финальное сохранение при размонтировании.
 */
export function useTheoryAutosave(resourceId: string) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const pendingRef = useRef<JSONContent | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flushSave = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const content = pendingRef.current
    pendingRef.current = null
    if (!content) return

    setSaveState('saving')
    const savingStartedAt = Date.now()
    try {
      await saveTheoryContent({ resourceId, content })
      await holdMinSavingDuration(savingStartedAt)
      setSaveState('saved')
      setUpdatedAt(Date.now())
      info(`plugins/theory: autosave success (${resourceId})`)
    } catch (e) {
      await holdMinSavingDuration(savingStartedAt)
      logError(`plugins/theory: save content failed: ${e instanceof Error ? e.message : String(e)}`)
      setSaveState('error')
      // Возвращаем контент в очередь — следующее изменение или «Сохранить» повторят попытку.
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

  // Финальное сохранение при размонтировании / смене ресурса.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)

      const pending = pendingRef.current
      pendingRef.current = null
      if (!pending) return

      saveTheoryContent({ resourceId, content: pending }).catch((e) => {
        logError(`plugins/theory: final save failed: ${e instanceof Error ? e.message : String(e)}`)
      })
    }
  }, [resourceId])

  return { saveState, updatedAt, setUpdatedAt, scheduleSave }
}
