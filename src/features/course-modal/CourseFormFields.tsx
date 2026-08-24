import { useId } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { type CourseStatus, MAX_TAG_LENGTH } from '@/entities/course'
import { ColorPairPicker } from './ColorPairPicker'
import { Field } from './Field'
import { type StatusOption, StatusPicker } from './StatusPicker'
import { TagInput } from './TagInput'
import {
  type CourseFormErrors,
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
}

/** Поля формы курса: название, описание, теги, цвета карточки и статус. */
export function CourseFormFields({ values, errors, setField }: CourseFormFieldsProps) {
  const { t } = useTranslation('courseModal')
  const titleId = useId()
  const descriptionId = useId()
  const tagsId = useId()
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
        error={errors.name}
        count={[...values.name].length}
        max={NAME_MAX}
      >
        <NameInput
          id={titleId}
          value={values.name}
          maxLength={NAME_MAX + 20}
          placeholder={t('fields.namePlaceholder')}
          $invalid={Boolean(errors.name)}
          onChange={(event) => setField('name', event.target.value)}
        />
      </Field>

      <Field
        label={t('fields.description')}
        htmlFor={descriptionId}
        hint={t('fields.descriptionHint')}
        error={errors.description}
        count={values.description.length}
        max={DESCRIPTION_MAX}
      >
        <DescriptionArea
          id={descriptionId}
          value={values.description}
          $invalid={Boolean(errors.description)}
          placeholder={t('fields.descriptionPlaceholder')}
          onChange={(event) => setField('description', event.target.value)}
        />
      </Field>

      <Stack>
        <Field
          label={t('fields.tags')}
          htmlFor={tagsId}
          required
          error={errors.tags}
          hint={t('fields.tagsHint', { max: MAX_TAG_LENGTH })}
        >
          <TagInput id={tagsId} value={values.tags} onChange={(next) => setField('tags', next)} />
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
