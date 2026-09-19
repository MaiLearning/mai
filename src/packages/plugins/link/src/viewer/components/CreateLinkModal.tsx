import type { Course } from '@mai/course'
import { useTranslation } from '@mai/i18n'
import { notifyError, notifySuccess } from '@mai/notifications'
import { Button, Modal } from '@mai/theme'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { type CreateLinkInput, createLinkAtom, type LinkTarget } from '../../entity'
import { Input } from '../../ui'
import { OWNER_PLUGIN_ID } from '../core/constants'
import { Fields, FieldsLabel, FieldsSelect } from './CreateLinkModal.style'
import { type PickerResource, TargetPicker } from './TargetPicker'

export interface CreateLinkModalProps {
  opened: boolean
  onClose: () => void
  courseId: string
  resources: PickerResource[]
  courses: Course[]
}

/**
 * Модалка создания ребра: выбор источника (курс или ресурс курса),
 * цели (ресурс / курс / URI) и опционных названия/описания.
 * Ребро создаётся с владельцем — плагином internal-link.
 */
export function CreateLinkModal({
  opened,
  onClose,
  courseId,
  resources,
  courses,
}: CreateLinkModalProps) {
  const { t } = useTranslation('link')
  const createLink = useSetAtom(createLinkAtom)

  const [sourceSelect, setSourceSelect] = useState(`course:${courseId}`)
  const [target, setTarget] = useState<LinkTarget | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setSourceSelect(`course:${courseId}`)
    setTarget(null)
    setTitle('')
    setDescription('')
    setSubmitting(false)
  }

  const handleSubmit = async () => {
    if (!target) return
    const sep = sourceSelect.indexOf(':')
    const kind = sourceSelect.slice(0, sep)
    const sourceId = sourceSelect.slice(sep + 1)
    const input: CreateLinkInput = {
      sourceType: kind === 'course' ? 'course' : 'resource',
      sourceId,
      target,
      ownerPluginId: OWNER_PLUGIN_ID,
      title: title.trim() || null,
      description: description.trim() || null,
    }

    setSubmitting(true)
    try {
      await createLink({ courseId, input })
      notifySuccess(t('created_title'), t('created_message'))
      reset()
      onClose()
    } catch (e) {
      notifyError(t('create_failed'), e instanceof Error ? e.message : String(e))
      setSubmitting(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('modal_title')}
      dismissible={!submitting}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!target || submitting}>
            {t('create')}
          </Button>
        </>
      }
    >
      <Fields>
        <FieldsLabel>{t('source')}</FieldsLabel>
        <FieldsSelect value={sourceSelect} onChange={(e) => setSourceSelect(e.target.value)}>
          <option value={`course:${courseId}`}>{t('source_course')}</option>
          {resources.map((resource) => (
            <option key={resource.id} value={`resource:${resource.id}`}>
              {resource.name}
            </option>
          ))}
        </FieldsSelect>

        <TargetPicker
          target={target}
          onTargetChange={setTarget}
          resources={resources}
          courses={courses}
          currentCourseId={courseId}
          labels={{
            kindLabel: t('target'),
            resource: t('kind_resource'),
            course: t('kind_course'),
            uri: t('kind_uri'),
            pickResource: t('pick_resource'),
            pickCourse: t('pick_course'),
            uriPlaceholder: t('uri_placeholder'),
            invalidUri: t('invalid_uri'),
          }}
        />

        <Input
          label={t('link_title')}
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label={t('link_description')}
          value={description}
          maxLength={2000}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Fields>
    </Modal>
  )
}
