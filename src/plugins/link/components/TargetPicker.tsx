import { useState } from 'react'
import { Input } from '@/app/theme/components'
import type { Course } from '@/entities/course'
import type { LinkTarget } from '@/entities/link'
import { LINK_URI_PATTERN } from '@/entities/link'
import { KindTab, KindTabs, PickerField, PickerRoot, PickerSelect } from './TargetPicker.style'

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
    <PickerRoot>
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
          <PickerSelect
            value={target?.kind === 'resource' ? target.resourceId : ''}
            onChange={(e) => pickResource(e.target.value)}
          >
            <option value="">{labels.pickResource}</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </PickerSelect>
        </PickerField>
      )}

      {kind === 'course' && (
        <PickerField>
          <PickerSelect
            value={target?.kind === 'course' ? target.courseId : ''}
            onChange={(e) => pickCourse(e.target.value)}
          >
            <option value="">{labels.pickCourse}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
                {course.id === currentCourseId ? ' ★' : ''}
              </option>
            ))}
          </PickerSelect>
        </PickerField>
      )}

      {kind === 'uri' && (
        <PickerField>
          <Input
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
