import {
  InvalidDirectoryCourseIdError,
  InvalidDirectoryIdError,
  InvalidDirectoryNameError,
} from './exceptions'

type EntityError = new (message: string) => Error
function validateId(value: string, error: EntityError, label: string): string {
  const normalized = value.trim()
  if (!normalized) throw new error(`${label} не может быть пустым`)
  return normalized
}
export const validateDirectoryId = (value: string) =>
  validateId(value, InvalidDirectoryIdError, 'Идентификатор директории')
export const validateDirectoryCourseId = (value: string) =>
  validateId(value, InvalidDirectoryCourseIdError, 'Идентификатор курса')
export const validateDirectoryName = (value: string) =>
  validateId(value, InvalidDirectoryNameError, 'Название директории')
