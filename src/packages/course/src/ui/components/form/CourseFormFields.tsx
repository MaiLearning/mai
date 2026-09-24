import { useTranslation } from '@mai/i18n'
import { warn } from '@mai/tauri/logs'
import { Field, Stack, TextAreaField, TextField } from '@mai/theme'
import { useEffect, useId, useState } from 'react'
import { type CourseStatus, MAX_TAG_LENGTH } from '../../../core'
import { fetchAllTags } from '../../../services'
import { ColorPairPicker } from './ColorPairPicker'
import { type StatusOption, StatusPicker } from './StatusPicker'
import { TagInput } from './TagInput'
import {
  type CourseFormErrors,
  type CourseFormField,
  type CourseFormValues,
  DESCRIPTION_MAX,
  NAME_MAX,
} from './useCourseForm'

export interface CourseFormFieldsProps {
  values: CourseFormValues
  errors: CourseFormErrors
  setField: <K extends keyof CourseFormValues>(key: K, next: CourseFormValues[K]) => void
  /** Отмечает поле затронутым (blur): его ошибки видны до сабмита. */
  onFieldBlur: (field: CourseFormField) => void
}

/** Поля формы курса: название, описание, теги, цвета карточки и статус. */
export function CourseFormFields({ values, errors, setField, onFieldBlur }: CourseFormFieldsProps) {
  const { t } = useTranslation('course')
  const titleId = useId()
  const descriptionId = useId()
  const tagsId = useId()
  /** Подсказки тегов с backend (отсортированы по частоте), при ошибке — пустой список. */
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([])
  useEffect(() => {
    let cancelled = false
    fetchAllTags()
      .then((stats) => {
        if (!cancelled) setTagSuggestions(stats.map((stat) => stat.name))
      })
      .catch((e) => {
        // Подсказки необязательны: просто не показываем их.
        warn(`fetchAllTags failed — ${e instanceof Error ? e.message : String(e)}`)
      })

    return () => {
      cancelled = true
    }
  }, [])
  /** Ключ ошибки поля → переведённое сообщение (в ключ подставляется лимит {{max}}). */
  const errorText = (field: CourseFormField) => {
    const key = errors[field]
    if (!key) return undefined
    const max =
      field === 'description' ? DESCRIPTION_MAX : field === 'tags' ? MAX_TAG_LENGTH : undefined

    return t(key, { max })
  }
  const nameError = errorText('name')
  const descriptionError = errorText('description')
  const tagsError = errorText('tags')
  const statusOptions: StatusOption[] = (
    ['draft', 'in_progress', 'completed'] as CourseStatus[]
  ).map((value) => ({
    value,
    label: t(`statuses.${value}.label`),
    hint: t(`statuses.${value}.hint`),
  }))

  return (
    <>
      <TextField
        id={titleId}
        label={t('fields.name')}
        required
        error={nameError}
        count={[...values.name].length}
        max={NAME_MAX}
        value={values.name}
        maxLength={NAME_MAX + 20}
        placeholder={t('fields.namePlaceholder')}
        onChange={(event) => setField('name', event.target.value)}
        onBlur={() => onFieldBlur('name')}
      />

      <TextAreaField
        id={descriptionId}
        label={t('fields.description')}
        error={descriptionError}
        count={values.description.length}
        max={DESCRIPTION_MAX}
        value={values.description}
        placeholder={t('fields.descriptionPlaceholder')}
        onChange={(event) => setField('description', event.target.value)}
        onBlur={() => onFieldBlur('description')}
      />

      <Stack gap="sm">
        <Field
          label={t('fields.tags')}
          htmlFor={tagsId}
          error={tagsError}
          hint={t('fields.tagsHint', { max: MAX_TAG_LENGTH })}
        >
          {/* onBlur в React всплывает (focusout): ловим уход фокуса из TagInput снаружи */}
          <div onBlur={() => onFieldBlur('tags')}>
            <TagInput
              id={tagsId}
              value={values.tags}
              suggestions={tagSuggestions}
              onChange={(next) => setField('tags', next)}
            />
          </div>
        </Field>
      </Stack>

      <Field label={t('fields.colors')} hint={t('fields.colorsHint')}>
        <ColorPairPicker value={values.gradient} onChange={(next) => setField('gradient', next)} />
      </Field>

      <Field label={t('fields.status')}>
        <StatusPicker
          value={values.status}
          options={statusOptions}
          onChange={(next) => setField('status', next)}
        />
      </Field>
    </>
  )
}
