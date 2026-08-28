import { warn } from '@tauri-apps/plugin-log'
import { useEffect, useId, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { type CourseStatus, MAX_TAG_LENGTH } from '@/entities/course'
import { fetchAllTags } from '@/entities/course/services'
import { ColorPairPicker } from './ColorPairPicker'
import { Field } from './Field'
import { type StatusOption, StatusPicker } from './StatusPicker'
import { TagInput } from './TagInput'
import {
  type CourseFormErrors,
  type CourseFormField,
  type CourseFormValues,
  DESCRIPTION_MAX,
  NAME_MAX,
} from './useCourseForm'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`
const inputBase = css<{ $invalid?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14.5px;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    border-radius ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.75;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.primary)};
    /* Контрастное кольцо box-shadow оптически «выпрямляет» углы: компенсируем,
       слегка увеличивая радиус, чтобы скругление не казалось просевшим. */
    border-radius: calc(${({ theme }) => theme.radii.md} + 2px);
    box-shadow: 0 0 0 3px
      ${({ theme, $invalid }) => ($invalid ? theme.colors.dangerSurface : theme.colors.primarySurface)};
  }
`
const NameInput = styled.input<{ $invalid?: boolean }>`
  ${inputBase};
  height: 46px;
  padding: 0 14px;
`
const DescriptionArea = styled.textarea<{ $invalid?: boolean }>`
  ${inputBase};
  min-height: 104px;
  padding: 12px 14px;
  line-height: 1.55;
  resize: vertical;
`

export interface CourseFormFieldsProps {
  values: CourseFormValues
  errors: CourseFormErrors
  setField: <K extends keyof CourseFormValues>(key: K, next: CourseFormValues[K]) => void
  /** Отмечает поле затронутым (blur): его ошибки видны до сабмита. */
  onFieldBlur: (field: CourseFormField) => void
}

/** Поля формы курса: название, описание, теги, цвета карточки и статус. */
export function CourseFormFields({ values, errors, setField, onFieldBlur }: CourseFormFieldsProps) {
  const { t } = useTranslation('courseModal')
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
        warn(
          `features/course-modal: fetchAllTags failed — ${
            e instanceof Error ? e.message : String(e)
          }`,
        )
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
      <Field
        label={t('fields.name')}
        htmlFor={titleId}
        required
        error={nameError}
        count={[...values.name].length}
        max={NAME_MAX}
      >
        <NameInput
          id={titleId}
          value={values.name}
          maxLength={NAME_MAX + 20}
          placeholder={t('fields.namePlaceholder')}
          $invalid={Boolean(nameError)}
          onChange={(event) => setField('name', event.target.value)}
          onBlur={() => onFieldBlur('name')}
        />
      </Field>

      <Field
        label={t('fields.description')}
        htmlFor={descriptionId}
        error={descriptionError}
        count={values.description.length}
        max={DESCRIPTION_MAX}
      >
        <DescriptionArea
          id={descriptionId}
          value={values.description}
          $invalid={Boolean(descriptionError)}
          placeholder={t('fields.descriptionPlaceholder')}
          onChange={(event) => setField('description', event.target.value)}
          onBlur={() => onFieldBlur('description')}
        />
      </Field>

      <Stack>
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
