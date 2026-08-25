import { error as logError } from '@tauri-apps/plugin-log'
import { Sparkles } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { createCourse } from '@/entities/course/services'
import {
  CourseFormFields,
  type CourseFormValues,
  CoursePreviewHeader,
  emptyCourseForm,
  FormError,
  useCourseForm,
} from '@/features/course-modal'
import { notifyError, notifySuccess } from '@/utils/notifications'

interface CreateCourseModalProps {
  opened: boolean
  onClose: () => void
  /** Вызывается после успешного создания (например, для обновления списка). */
  onCreated?: (course: Course) => void
}

/**
 * Модальное окно создания курса с живым превью карточки.
 * После успешного создания закрывается и выполняет переход в новый курс.
 */
export function CreateCourseModal({ opened, onClose, onCreated }: CreateCourseModalProps) {
  const { t } = useTranslation('courseModal')
  const navigate = useNavigate()
  const titleId = useId()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { values, setField, blur, errors, isValid, submit } = useCourseForm(emptyCourseForm, opened)

  // Сброс состояния отправки при каждом открытии модалки
  useEffect(() => {
    if (!opened) return
    setSubmitting(false)
    setFormError(null)
  }, [opened])

  const runCreate = async (payload: CourseFormValues) => {
    if (submitting) return

    setSubmitting(true)
    setFormError(null)
    try {
      const course = await createCourse({
        name: payload.name,
        description: payload.description || null,
        tags: payload.tags,
        colorFrom: payload.gradient.from,
        colorTo: payload.gradient.to,
        status: payload.status,
      })
      notifySuccess(t('notifications.createSuccess'), course.name)
      onCreated?.(course)
      onClose()
      void navigate(`/course/${course.id}`)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      void logError(`pages/home: createCourse failed: ${message}`)
      setFormError(message)
      notifyError(t('notifications.createError'), message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} dismissible={!submitting} labelledBy={titleId}>
      <CoursePreviewHeader
        values={values}
        eyebrow={t('createEyebrow')}
        onClose={onClose}
        titleId={titleId}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit((payload) => void runCreate(payload))
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
          {formError && <FormError role="alert">{formError}</FormError>}
        </ModalBody>

        <ModalFooter>
          <ModalFooterSpacer />
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" disabled={!isValid || submitting}>
            {submitting ? (
              <>
                <Spinner label={t('actions.creating')} />
                {t('actions.creating')}
              </>
            ) : (
              <>
                <Sparkles size={16} aria-hidden="true" />
                {t('actions.create')}
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
