import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type CourseStatus,
  InvalidCourseDescriptionError,
  InvalidCourseNameError,
  InvalidCourseTagsError,
  MAX_TAG_LENGTH,
  validateCourseDescription,
  validateCourseName,
  validateCourseTags,
} from '@/entities/course'
import type { CourseGradient } from './ColorPairPicker'
import { GRADIENT_PRESETS } from './constants'

/** Лимиты полей для счётчиков формы. */
export const NAME_MAX = 120
export const DESCRIPTION_MAX = 2000

export { MAX_TAG_LENGTH as TAG_MAX }

export interface CourseFormValues {
  name: string
  description: string
  tags: string[]
  gradient: CourseGradient
  status: CourseStatus
}

export const emptyCourseForm: CourseFormValues = {
  name: '',
  description: '',
  tags: [],
  gradient: { from: GRADIENT_PRESETS[0].from, to: GRADIENT_PRESETS[0].to },
  status: 'draft',
}

/** Поля формы с валидацией и состоянием «затронуто». */
export type CourseFormField = 'name' | 'description' | 'tags'

/**
 * Ошибки полей: значения — ключи i18n неймспейса courseModal (validation.*),
 * а не готовые сообщения: перевод выполняется в UI-слое.
 */
export type CourseFormErrors = Partial<Record<CourseFormField, string>>

function validate(values: CourseFormValues): CourseFormErrors {
  const errors: CourseFormErrors = {}

  try {
    validateCourseName(values.name)
  } catch (e) {
    if (e instanceof InvalidCourseNameError) errors.name = 'validation.nameRange'
  }

  try {
    validateCourseDescription(values.description === '' ? null : values.description)
  } catch (e) {
    if (e instanceof InvalidCourseDescriptionError) errors.description = 'validation.descriptionMax'
  }

  try {
    validateCourseTags(values.tags)
  } catch (e) {
    if (e instanceof InvalidCourseTagsError) errors.tags = 'validation.tagMax'
  }

  return errors
}

/**
 * Состояние формы курса: значения, ошибки по полям, затронутые поля,
 * признак изменений относительно начальных значений и отправка.
 * Ошибки поля видны после его blur либо после первого сабмита (все сразу).
 * Теги не обязательны: ошибка только про длину отдельного тега.
 * Форма сбрасывается к initial при каждом открытии окна (open = true).
 */
export function useCourseForm(initial: CourseFormValues, open: boolean) {
  const [values, setValues] = useState(initial)
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CourseFormField, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (open) {
      setValues(initial)
      setTouchedFields({})
      setSubmitted(false)
    }
    // Сброс привязан к open: initial пересоздаётся родителем на каждый course/open.
  }, [open])

  const setField = useCallback(
    <K extends keyof CourseFormValues>(key: K, next: CourseFormValues[K]) =>
      setValues((current) => ({ ...current, [key]: next })),
    [],
  )
  /** Отмечает поле затронутым: его ошибки становятся видимыми до сабмита. */
  const blur = useCallback((field: CourseFormField) => {
    setTouchedFields((current) => ({ ...current, [field]: true }))
  }, [])
  const errors = useMemo(() => validate(values), [values])
  const visibleErrors = useMemo(() => {
    if (submitted) return errors

    const result: CourseFormErrors = {}
    for (const field of Object.keys(touchedFields) as CourseFormField[]) {
      if (touchedFields[field] && errors[field]) result[field] = errors[field]
    }

    return result
  }, [submitted, touchedFields, errors])
  const isValid = Object.keys(errors).length === 0
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial],
  )
  const submit = useCallback(
    (onValid: (values: CourseFormValues) => void) => {
      setSubmitted(true)
      setTouchedFields({ name: true, description: true, tags: true })
      if (!isValid) return false
      onValid({
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
        tags: validateCourseTags(values.tags),
      })

      return true
    },
    [isValid, values],
  )

  return { values, setField, blur, errors: visibleErrors, isValid, isDirty, submit }
}
