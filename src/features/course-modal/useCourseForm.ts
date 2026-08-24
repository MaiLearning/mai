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

export type CourseFormErrors = Partial<Record<'name' | 'description' | 'tags', string>>

function validate(values: CourseFormValues): CourseFormErrors {
  const errors: CourseFormErrors = {}

  try {
    validateCourseName(values.name)
  } catch (e) {
    if (e instanceof InvalidCourseNameError) errors.name = e.message
  }

  try {
    validateCourseDescription(values.description === '' ? null : values.description)
  } catch (e) {
    if (e instanceof InvalidCourseDescriptionError) errors.description = e.message
  }

  try {
    validateCourseTags(values.tags)
    if (values.tags.length === 0) errors.tags = 'Добавьте хотя бы одну тему'
  } catch (e) {
    if (e instanceof InvalidCourseTagsError) errors.tags = e.message
  }

  return errors
}

/**
 * Состояние формы курса: значения, ошибки (после первого сабмита),
 * признак изменений относительно начальных значений и отправка.
 * Форма сбрасывается к initial при каждом открытии окна (open = true).
 */
export function useCourseForm(initial: CourseFormValues, open: boolean) {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setValues(initial)
      setTouched(false)
    }
    // Сброс привязан к open: initial пересоздаётся родителем на каждый course/open.
  }, [open])

  const setField = useCallback(
    <K extends keyof CourseFormValues>(key: K, next: CourseFormValues[K]) =>
      setValues((current) => ({ ...current, [key]: next })),
    [],
  )
  const errors = useMemo(() => validate(values), [values])
  const visibleErrors = touched ? errors : {}
  const isValid = Object.keys(errors).length === 0
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial],
  )
  const submit = useCallback(
    (onValid: (values: CourseFormValues) => void) => {
      setTouched(true)
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

  return { values, setField, errors: visibleErrors, isValid, isDirty, submit }
}
