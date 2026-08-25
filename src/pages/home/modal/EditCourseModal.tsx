import { error as logError } from '@tauri-apps/plugin-log'
import { Check } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@/app/i18n'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterSpacer,
  Spinner,
} from '@/app/theme/components'
import type { Course } from '@/entities/course'
import { deleteCourse, updateCourse } from '@/entities/course/services'
import {
  CourseFormFields,
  type CourseFormValues,
  CoursePreviewHeader,
  DangerPlate,
  DirtyBadge,
  emptyCourseForm,
  FormError,
  useCourseForm,
} from '@/features/course-modal'
import { notifyError, notifySuccess } from '@/utils/notifications'

const SectionDivider = styled.hr`
  height: 1px;
  margin: 0;
  border: none;
  background: ${({ theme }) => theme.colors.border};
`

interface EditCourseModalProps {
  opened: boolean
  /** Редактируемый курс. */
  course: Course | null
  onClose: () => void
  /** Вызывается после успешного сохранения (например, для обновления списка). */
  onSaved?: (course: Course) => void
  /** Вызывается после успешного удаления курса. */
  onDeleted?: (course: Course) => void
}

/**
 * Модальное окно настроек курса с живым превью карточки:
 * редактирование полей, несохранённые изменения и удаление в два шага.
 */
export function EditCourseModal({
  opened,
  course,
  onClose,
  onSaved,
  onDeleted,
}: EditCourseModalProps) {
  const { t } = useTranslation('courseModal')
  const titleId = useId()
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [armed, setArmed] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const initial = useMemo<CourseFormValues>(
    () =>
      course
        ? {
            name: course.name,
            description: course.description ?? '',
            tags: course.tags,
            gradient: {
              from: course.colorFrom ?? emptyCourseForm.gradient.from,
              to: course.colorTo ?? emptyCourseForm.gradient.to,
            },
            status: course.status,
          }
        : emptyCourseForm,
    [course],
  )
  const { values, setField, errors, isValid, isDirty, submit } = useCourseForm(initial, opened)
  const busy = submitting || deleting

  // Сброс состояния при каждом открытии модалки
  useEffect(() => {
    if (!opened || !course) return
    setSubmitting(false)
    setDeleting(false)
    setArmed(false)
    setFormError(null)
  }, [opened, course])

  const runSave = async (payload: CourseFormValues) => {
    if (!course || submitting) return

    setSubmitting(true)
    setFormError(null)
    try {
      const updated = await updateCourse({
        id: course.id,
        name: payload.name,
        description: payload.description || null,
        tags: payload.tags,
        colorFrom: payload.gradient.from,
        colorTo: payload.gradient.to,
        status: payload.status,
      })
      notifySuccess(t('notifications.saveSuccess'), updated.name)
      onSaved?.(updated)
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      void logError(`pages/home: updateCourse failed: ${message}`)
      setFormError(message)
      notifyError(t('notifications.saveError'), message)
    } finally {
      setSubmitting(false)
    }
  }
  const runDelete = async () => {
    if (!course || deleting) return

    setDeleting(true)
    setFormError(null)
    try {
      await deleteCourse(course.id)
      notifySuccess(t('notifications.deleteSuccess'), course.name)
      onDeleted?.(course)
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      void logError(`pages/home: deleteCourse failed: ${message}`)
      setFormError(message)
      notifyError(t('notifications.deleteError'), message)
      setArmed(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} dismissible={!busy} labelledBy={titleId}>
      <CoursePreviewHeader
        values={values}
        eyebrow={t('editEyebrow')}
        onClose={onClose}
        titleId={titleId}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit((payload) => void runSave(payload))
        }}
        style={{ display: 'contents' }}
      >
        <ModalBody>
          <CourseFormFields values={values} errors={errors} setField={setField} />

          <SectionDivider />

          <DangerPlate
            armed={armed}
            busy={busy}
            courseName={course?.name ?? ''}
            onArm={() => setArmed(true)}
            onDisarm={() => setArmed(false)}
            onDelete={() => void runDelete()}
          />

          {formError && <FormError role="alert">{formError}</FormError>}
        </ModalBody>

        <ModalFooter>
          {isDirty ? <DirtyBadge /> : null}
          <ModalFooterSpacer />
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" disabled={!isValid || !isDirty || submitting}>
            {submitting ? (
              <>
                <Spinner label={t('actions.saving')} />
                {t('actions.saving')}
              </>
            ) : (
              <>
                <Check size={16} aria-hidden="true" />
                {t('actions.save')}
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
