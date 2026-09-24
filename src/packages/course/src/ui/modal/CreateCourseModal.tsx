import { useTranslation } from '@mai/i18n'
import { error as logError } from '@mai/tauri/logs'
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterSpacer,
  Spinner,
} from '@mai/theme'
import { Sparkles } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import type { Course } from '../../core'
import { createCourse } from '../../services'
import {
  CourseFormFields,
  type CourseFormValues,
  CoursePreviewHeader,
  emptyCourseForm,
  useCourseForm,
} from '../components/form'

interface CreateCourseModalProps {
  opened: boolean
  onClose: () => void
  /** Вызывается после успешного создания (например, для перехода в курс). */
  onCreated?: (course: Course) => void
}

/**
 * Модальное окно создания курса с живым превью карточки.
 * После успешного создания закрывается и отдаёт курс наружу через onCreated.
 */
export function CreateCourseModal({ opened, onClose, onCreated }: CreateCourseModalProps) {
  const { t } = useTranslation('course')
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
      // TODO(course): уведомление об успешном создании — подключить, когда в пакете появится notifications
      onCreated?.(course)
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logError(`createCourse failed: ${message}`)
      setFormError(message)
      // TODO(course): уведомление об ошибке создания — подключить, когда в пакете появится notifications
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
          {formError && <Alert variant="error">{formError}</Alert>}
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
