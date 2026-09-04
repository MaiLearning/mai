import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Button, Input } from '@/app/theme/components'
import type { Course } from '@/entities/course'
import { deleteLinkAtom, type Link, type LinkTarget, updateLinkAtom } from '@/entities/link'
import { notifyError, notifySuccess } from '@/utils/notifications'
import { OWNER_PLUGIN_ID } from '../core/constants'
import {
  BrokenBadge,
  EndpointLabel,
  Endpoints,
  PanelRoot,
  PanelRow,
  PanelTitle,
  TargetSection,
} from './EdgeDetailsPanel.style'
import { type PickerResource, TargetPicker } from './TargetPicker'

export interface EdgeDetailsPanelProps {
  link: Link
  resourceNames: Record<string, string>
  courseNames: Record<string, string>
  resources: PickerResource[]
  courses: Course[]
  currentCourseId: string
  onClose: () => void
  onNavigate: (target: LinkTarget) => void
}

/**
 * Панель выбранного ребра: маршрут, правка названия/описания/цели,
 * переход и удаление (с подтверждением). Все операции — от имени
 * плагина-владельца internal-link.
 */
export function EdgeDetailsPanel({
  link,
  resourceNames,
  courseNames,
  resources,
  courses,
  currentCourseId,
  onClose,
  onNavigate,
}: EdgeDetailsPanelProps) {
  const { t } = useTranslation('link')
  const updateLink = useSetAtom(updateLinkAtom)
  const deleteLink = useSetAtom(deleteLinkAtom)

  const [title, setTitle] = useState(link.title ?? '')
  const [description, setDescription] = useState(link.description ?? '')
  const [target, setTarget] = useState<LinkTarget | null>(link.target)
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setTitle(link.title ?? '')
    setDescription(link.description ?? '')
    setTarget(link.target)
    setArmed(false)
  }, [link.id, link.title, link.description, link.target])

  const run = async (action: () => Promise<void>, successMessage: string) => {
    setBusy(true)
    try {
      await action()
      notifySuccess(successMessage, '')
    } catch (e) {
      notifyError(t('operation_failed'), e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const saveMeta = () =>
    run(async () => {
      await updateLink({
        id: link.id,
        ownerPluginId: OWNER_PLUGIN_ID,
        title: title.trim() || null,
        description: description.trim() || null,
        target: target ?? link.target,
      })
    }, t('updated_title'))

  const remove = () => {
    if (!armed) {
      setArmed(true)

      return
    }
    void run(async () => {
      await deleteLink({ id: link.id, ownerPluginId: OWNER_PLUGIN_ID })
      onClose()
    }, t('deleted_title'))
  }

  const sourceLabel =
    link.sourceType === 'course'
      ? (courseNames[link.sourceId] ?? t('node_course'))
      : (resourceNames[link.sourceId] ?? t('node_resource'))
  const targetLabel =
    link.target.kind === 'resource'
      ? (resourceNames[link.target.resourceId] ?? t('node_resource'))
      : link.target.kind === 'course'
        ? (courseNames[link.target.courseId] ?? t('node_course'))
        : link.target.uri

  return (
    <PanelRoot>
      <PanelTitle>{t('details_title')}</PanelTitle>

      {link.targetStatus === 'broken' && <BrokenBadge>{t('broken_badge')}</BrokenBadge>}

      <Endpoints>
        <div>
          <EndpointLabel>{t('source')}</EndpointLabel>
          {sourceLabel}
        </div>
        <div>
          <EndpointLabel>{t('target')}</EndpointLabel>
          {targetLabel}
        </div>
      </Endpoints>

      <PanelRow>
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
      </PanelRow>

      <TargetSection>
        <TargetPicker
          target={target}
          onTargetChange={setTarget}
          resources={resources}
          courses={courses}
          currentCourseId={currentCourseId}
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
      </TargetSection>

      <PanelRow>
        <Button variant="secondary" disabled={busy} onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button disabled={busy || !target} onClick={() => void saveMeta()}>
          {t('save')}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => onNavigate(link.target)}>
          {t('open')}
        </Button>
        <Button variant="danger" disabled={busy} onClick={remove}>
          {armed ? t('confirm_delete') : t('delete')}
        </Button>
      </PanelRow>
    </PanelRoot>
  )
}
