import { notifyError } from '@mai/notifications'
import { info, error as logError } from '@mai/tauri/logs'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CodeLanguage, CodeLessonContent, CodeStep, CodeStepResult } from '../../entity'
import { fetchCodeContentSnapshot } from '../../entity/services'
import { useCodeAutosave } from './useCodeAutosave'

const DEFAULT_CONTENT: CodeLessonContent = {
  language: 'python',
  steps: [],
  code: {},
  results: {},
}

const MAX_TITLE_FALLBACK = 200

/** Копия словаря без ключа (удаление записи, а не запись undefined). */
function omitKey<T>(obj: Record<string, T>, key: string): Record<string, T> {
  const { [key]: _removed, ...rest } = obj

  return rest
}

/**
 * Контент урока кода: шаги, код ученика, результаты проверок.
 * Загрузка снапшота при монтировании; каждая мутация оптимистично
 * меняет локальное зеркало и планирует автосохранение целиком.
 */
export function useCodeContent(resourceId: string) {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<CodeLessonContent>(DEFAULT_CONTENT)
  const contentRef = useRef(content)
  const { saveState, scheduleSave } = useCodeAutosave(resourceId)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setContent(DEFAULT_CONTENT)
    contentRef.current = DEFAULT_CONTENT

    fetchCodeContentSnapshot(resourceId)
      .then((snapshot) => {
        if (cancelled) return
        contentRef.current = snapshot.content
        setContent(snapshot.content)
        info(`Урок кода ${resourceId} загружен: шагов ${snapshot.content.steps.length}`)
      })
      .catch((e) => {
        logError(
          `Не удалось загрузить урок кода ${resourceId}: ${e instanceof Error ? e.message : String(e)}`,
        )
        if (!cancelled) notifyError('Урок не загрузился', 'Попробуйте открыть ресурс заново')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [resourceId])

  /** Оптимистичный апдейт локального зеркала + планирование автосохранения. */
  const apply = useCallback(
    (updater: (prev: CodeLessonContent) => CodeLessonContent) => {
      const next = updater(contentRef.current)
      if (next === contentRef.current) return
      contentRef.current = next
      setContent(next)
      scheduleSave(next)
    },
    [scheduleSave],
  )

  /** Новый шаг с дефолтным содержимым; id возвращается для фокуса. */
  const addStep = useCallback((): string => {
    const id = crypto.randomUUID()
    const step: CodeStep = {
      id,
      title: '',
      instructions: '',
      starterCode: '',
      expectedOutput: '',
    }
    apply((prev) => ({ ...prev, steps: [...prev.steps, step] }))
    info(`Шаг урока ${resourceId} создан: ${id}`)

    return id
  }, [apply, resourceId])

  /** Удаление шага вместе с кодом ученика и результатом. */
  const deleteStep = useCallback(
    (stepId: string) => {
      apply((prev) => ({
        ...prev,
        steps: prev.steps.filter((s) => s.id !== stepId),
        code: omitKey(prev.code, stepId),
        results: omitKey(prev.results, stepId),
      }))
      info(`Шаг урока ${resourceId} удалён: ${stepId}`)
    },
    [apply, resourceId],
  )

  /**
   * Правка определения шага в редакторе: контент шага — прогресс;
   * смена стартового кода подтягивает код ученика.
   */
  const updateStep = useCallback(
    (stepId: string, patch: Partial<Omit<CodeStep, 'id'>>) => {
      apply((prev) => ({
        ...prev,
        steps: prev.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
        code:
          patch.starterCode === undefined
            ? prev.code
            : { ...prev.code, [stepId]: patch.starterCode },
        results: omitKey(prev.results, stepId),
      }))
    },
    [apply],
  )

  /** Смена языка урока: результаты прохождения сбрасываются. */
  const setLanguage = useCallback(
    (language: CodeLanguage) => {
      apply((prev) => ({ ...prev, language, results: {} }))
    },
    [apply],
  )

  /** Правка кода ученика: результат шага сбрасывается. */
  const setStepCode = useCallback(
    (stepId: string, code: string) => {
      apply((prev) => ({
        ...prev,
        code: { ...prev.code, [stepId]: code },
        results: omitKey(prev.results, stepId),
      }))
    },
    [apply],
  )

  /** Фиксация результата проверки шага. */
  const setStepResult = useCallback(
    (stepId: string, result: CodeStepResult) => {
      apply((prev) => ({ ...prev, results: { ...prev.results, [stepId]: result } }))
    },
    [apply],
  )

  /** «Пройти заново»: результат стирается, код ученика остаётся. */
  const resetStep = useCallback(
    (stepId: string) => {
      apply((prev) => ({ ...prev, results: omitKey(prev.results, stepId) }))
    },
    [apply],
  )

  return {
    loading,
    content,
    saveState,
    addStep,
    deleteStep,
    updateStep,
    setLanguage,
    setStepCode,
    setStepResult,
    resetStep,
  }
}

/** Заголовок шага по умолчанию, если автор его не задал. */
export function stepTitle(step: CodeStep, index: number): string {
  const title = step.title.trim()

  return title === '' ? `Шаг ${index + 1}`.slice(0, MAX_TITLE_FALLBACK) : title
}
