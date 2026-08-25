import {
  InvalidDirectoryIdError,
  InvalidDirectoryNameError,
  InvalidParentError,
  InvalidPositionError,
  InvalidStructureNodeIdError,
  InvalidStructureResourceIdError,
  InvalidStructureResourceNameError,
} from './exceptions'

type EntityError = new (message: string) => Error
function id(value: string, error: EntityError, label: string): string {
  const normalized = value.trim()
  if (!normalized) throw new error(`${label} не может быть пустым`)

  return normalized
}
export const validateNodeId = (value: string) =>
  id(value, InvalidStructureNodeIdError, 'Идентификатор узла')
export const validateResourceId = (value: string) =>
  id(value, InvalidStructureResourceIdError, 'Идентификатор ресурса')
export const validateDirectoryId = (value: string) =>
  id(value, InvalidDirectoryIdError, 'Идентификатор директории')
export const validateCourseId = (value: string) =>
  id(value, InvalidParentError, 'Идентификатор курса')
export const validateDirectoryName = (value: string) =>
  id(value, InvalidDirectoryNameError, 'Название директории')
export const validateStructureResourceName = (value: string) =>
  id(value, InvalidStructureResourceNameError, 'Название ресурса')
export function validatePosition(value: number): number {
  if (value < 0) throw new InvalidPositionError('Позиция не может быть отрицательной')

  return value
}
