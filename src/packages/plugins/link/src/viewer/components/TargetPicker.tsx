import type { Course } from '@mai/course'
import { Select, TextField } from '@mai/theme'
import { useMemo, useState } from 'react'
import { LINK_URI_PATTERN, type LinkTarget } from '../../entity'
import { KindTab, KindTabs, PickerField, PickerRoot } from './TargetPicker.style'

export type TargetKind = 'resource' | 'course' | 'uri'

export interface PickerResource {
  id: string
  name: string
  courseId: string
}

export interface TargetPickerProps {
  /** Текущее значение цели (или null — не выбрана). */
  target: LinkTarget | null
  onTargetChange: (target: LinkTarget | null) => void
  /** Ресурсы текущего курса (для выбора ресурса). */
  resources: PickerResource[]
  /** Все курсы (для выбора курса-цели). */
  courses: Course[]
  currentCourseId: string
  /** Подписи полей (i18n уже разрешён в родителе). */
  labels: {
    /** Подпись группы выбора цели — идёт в `aria-label` корня. */
    kindLabel: string
    resource: string
    course: string
    uri: string
    pickResource: string
    pickCourse: string
    uriPlaceholder: string
    invalidUri: string
  }
}

/**
 * Выбор цели ребра: тип (ресурс / курс / URI) и конкретное значение.
 * Универсальный блок — используется при создании и при правке цели.
 */
export function TargetPicker({
  target,
  onTargetChange,
  resources,
  courses,
  currentCourseId,
  labels,
}: TargetPickerProps) {
  const [kind, setKind] = useState<TargetKind>(target?.kind ?? 'resource')
  const [uriText, setUriText] = useState(target?.kind === 'uri' ? target.uri : '')

  const resourceItems = useMemo(
    () => resources.map((resource) => ({ value: resource.id, label: resource.name })),
    [resources],
  )

  const courseItems = useMemo(
    () =>
      courses.map((course) => ({
        value: course.id,
        label: course.id === currentCourseId ? `${course.name} ★` : course.name,
      })),
    [courses, currentCourseId],
  )

  const switchKind = (next: TargetKind) => {
    setKind(next)
    onTargetChange(null)
  }

  const pickResource = (id: string) => {
    const resource = resources.find((item) => item.id === id)
    onTargetChange(
      resource ? { kind: 'resource', courseId: resource.courseId, resourceId: id } : null,
    )
  }

  const pickCourse = (id: string) => {
    onTargetChange(id ? { kind: 'course', courseId: id } : null)
  }

  const changeUri = (value: string) => {
    setUriText(value)
    onTargetChange(LINK_URI_PATTERN.test(value.trim()) ? { kind: 'uri', uri: value.trim() } : null)
  }

  const uriInvalid =
    kind === 'uri' && uriText.trim() !== '' && !LINK_URI_PATTERN.test(uriText.trim())

  return (
    <PickerRoot role="group" aria-label={labels.kindLabel}>
      <KindTabs>
        <KindTab $active={kind === 'resource'} onClick={() => switchKind('resource')}>
          {labels.resource}
        </KindTab>
        <KindTab $active={kind === 'course'} onClick={() => switchKind('course')}>
          {labels.course}
        </KindTab>
        <KindTab $active={kind === 'uri'} onClick={() => switchKind('uri')}>
          {labels.uri}
        </KindTab>
      </KindTabs>

      {kind === 'resource' && (
        <PickerField>
          <Select
            aria-label={labels.pickResource}
            placeholder={labels.pickResource}
            value={target?.kind === 'resource' ? target.resourceId : ''}
            items={resourceItems}
            onChange={pickResource}
          />
        </PickerField>
      )}

      {kind === 'course' && (
        <PickerField>
          <Select
            aria-label={labels.pickCourse}
            placeholder={labels.pickCourse}
            value={target?.kind === 'course' ? target.courseId : ''}
            items={courseItems}
            onChange={pickCourse}
          />
        </PickerField>
      )}

      {kind === 'uri' && (
        <PickerField>
          <TextField
            value={uriText}
            placeholder={labels.uriPlaceholder}
            onChange={(e) => changeUri(e.target.value)}
            error={uriInvalid ? labels.invalidUri : undefined}
          />
        </PickerField>
      )}
    </PickerRoot>
  )
}
