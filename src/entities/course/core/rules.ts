import {
  InvalidCourseDescriptionError,
  InvalidCourseIdError,
  InvalidCourseNameError,
  InvalidCourseTimelineError,
} from './exceptions'

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
