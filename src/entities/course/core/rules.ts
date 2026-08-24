import {
  InvalidCourseColorError,
  InvalidCourseDescriptionError,
  InvalidCourseIdError,
  InvalidCourseNameError,
  InvalidCourseStatusError,
  InvalidCourseTimelineError,
  InvalidCourseTopicError,
} from './exceptions'
import type { CourseStatus } from './schema'

export const COURSE_STATUSES: CourseStatus[] = ['draft', 'in_progress', 'completed']
export const DEFAULT_COURSE_STATUS: CourseStatus = 'draft'
export const MAX_TOPIC_LENGTH = 80

export function validateCourseName(name: string): string {
  const value = name.trim()
  if (value.length < 3 || value.length > 120)
    throw new InvalidCourseNameError('Название курса должно содержать от 3 до 120 символов')
  return value
}
export function validateCourseDescription(description: string | null): string | null {
  if (description === null) return null
  const value = description.trim()
  if (value.length > 2000)
    throw new InvalidCourseDescriptionError('Описание курса не должно превышать 2000 символов')
  return value || null
}
export function validateCourseId(id: string): string {
  const value = id.trim()
  if (!value) throw new InvalidCourseIdError('Идентификатор курса не может быть пустым')
  return value
}
export function validateCourseTimeline(createdAt: number, updatedAt: number): void {
  if (updatedAt < createdAt)
    throw new InvalidCourseTimelineError('Дата обновления не может быть раньше даты создания')
}
export function validateCourseTopic(topic: string | null): string | null {
  if (topic === null) return null
  const value = topic.trim()
  if (!value) return null
  if (value.length > MAX_TOPIC_LENGTH)
    throw new InvalidCourseTopicError(`Тема курса не должна превышать ${MAX_TOPIC_LENGTH} символов`)
  return value
}
export function validateCourseColor(color: string | null): string | null {
  if (color === null) return null
  const value = color.trim()
  if (!value) return null
  if (!/^#[0-9a-fA-F]{6}$/.test(value))
    throw new InvalidCourseColorError('Цвет курса должен быть в формате #RRGGBB')
  return value.toLowerCase()
}
export function validateCourseStatus(status: CourseStatus | string): CourseStatus {
  const value = status.trim().toLowerCase()
  if (!COURSE_STATUSES.includes(value as CourseStatus))
    throw new InvalidCourseStatusError(
      `Статус курса должен быть одним из: ${COURSE_STATUSES.join(', ')}`,
    )
  return value as CourseStatus
}
