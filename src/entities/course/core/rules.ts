import {
  InvalidCourseColorError,
  InvalidCourseDescriptionError,
  InvalidCourseIdError,
  InvalidCourseNameError,
  InvalidCourseStatusError,
  InvalidCourseTagsError,
  InvalidCourseTimelineError,
} from './exceptions'
import type { CourseStatus } from './schema'

export const COURSE_STATUSES: CourseStatus[] = ['draft', 'in_progress', 'completed']
export const DEFAULT_COURSE_STATUS: CourseStatus = 'draft'
/** Максимальная длина одного тега в символах (не байтах — теги кириллические). */
export const MAX_TAG_LENGTH = 32

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
/**
 * Проверяет и нормализует список тегов курса: обрезает пробелы, отбрасывает
 * пустые, снимает дубли без учёта регистра. Количество тегов не ограничено,
 * каждый тег — от 1 до MAX_TAG_LENGTH символов.
 */
export function validateCourseTags(tags: string[]): string[] {
  const normalized: string[] = []
  for (const tag of tags) {
    const value = tag.trim()
    if (!value) continue
    if ([...value].length > MAX_TAG_LENGTH)
      throw new InvalidCourseTagsError(`Тег курса не должен превышать ${MAX_TAG_LENGTH} символов`)
    if (normalized.some((existing) => existing.toLowerCase() === value.toLowerCase())) continue
    normalized.push(value)
  }
  return normalized
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
