import { useTranslation } from '@mai/i18n'
import { error as logError } from '@mai/tauri/logs'
import {
  Alert,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterSpacer,
  Spinner,
} from '@mai/theme'
import { Check } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import type { Course } from '../../core'
import { deleteCourse, updateCourse } from '../../services'
import {
  CourseFormFields,
  type CourseFormValues,
  CoursePreviewHeader,
  DangerPlate,
  emptyCourseForm,
  useCourseForm,
} from '../components/form'
import { SectionDivider } from './EditCourseModal.style'

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
  const { t } = useTranslation('course')
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
  const { values, setField, blur, errors, isValid, isDirty, submit } = useCourseForm(
    initial,
    opened,
  )
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
      // TODO(course): уведомление об успешном сохранении — подключить, когда в пакете появится notifications
      onSaved?.(updated)
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logError(`updateCourse failed: ${message}`)
      setFormError(message)
      // TODO(course): уведомление об ошибке сохранения — подключить, когда в пакете появится notifications
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
      // TODO(course): уведомление об успешном удалении — подключить, когда в пакете появится notifications
      onDeleted?.(course)
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logError(`deleteCourse failed: ${message}`)
      setFormError(message)
      // TODO(course): уведомление об ошибке удаления — подключить, когда в пакете появится notifications
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
          <CourseFormFields
            values={values}
            errors={errors}
            setField={setField}
            onFieldBlur={blur}
          />

          <SectionDivider />

          <DangerPlate
            armed={armed}
            busy={busy}
            courseName={course?.name ?? ''}
            onArm={() => setArmed(true)}
            onDisarm={() => setArmed(false)}
            onDelete={() => void runDelete()}
          />

          {formError && <Alert variant="error">{formError}</Alert>}
        </ModalBody>

        <ModalFooter>
          {isDirty ? <Badge tone="warning">{t('dirtyBadge')}</Badge> : null}
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
