import {
  InvalidResourceCourseIdError,
  InvalidResourceIdError,
  InvalidResourceNameError,
  InvalidResourceTypeDescriptionError,
  InvalidResourceTypeExtensionError,
  InvalidResourceTypeKeyError,
  InvalidResourceTypeNameError,
} from './exceptions'

type EntityError = new (message: string) => Error
function bounded(
  value: string,
  min: number,
  max: number,
  error: EntityError,
  label: string,
): string {
  const normalized = value.trim()
  if (normalized.length < min || normalized.length > max)
    throw new error(`${label}: допустимо от ${min} до ${max} символов`)
  return normalized
}
export const validateResourceTypeKey = (v: string) =>
  bounded(v, 1, 64, InvalidResourceTypeKeyError, 'Ключ типа ресурса')
export const validateResourceTypeName = (v: string) =>
  bounded(v, 2, 120, InvalidResourceTypeNameError, 'Название типа ресурса')
export const validateResourceName = (v: string) =>
  bounded(v, 2, 200, InvalidResourceNameError, 'Название ресурса')
export const validateResourceId = (v: string) =>
  bounded(v, 1, 64, InvalidResourceIdError, 'Идентификатор ресурса')
export const validateResourceCourseId = (v: string) =>
  bounded(v, 1, 64, InvalidResourceCourseIdError, 'Идентификатор курса ресурса')
export function validateResourceTypeDescription(value: string): string {
  const normalized = value.trim()
  if (normalized.length > 1000)
    throw new InvalidResourceTypeDescriptionError(
      'Описание типа ресурса не должно превышать 1000 символов',
    )
  return normalized
}
export function validateResourceTypeExtensions(values: string[]): string[] {
  return values.map((value) => {
    const normalized = value.trim()
    if (!normalized || !normalized.startsWith('.'))
      throw new InvalidResourceTypeExtensionError('Расширение должно начинаться с точки')
    return normalized
  })
}
