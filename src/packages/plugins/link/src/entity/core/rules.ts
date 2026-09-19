import {
  InvalidLinkDescriptionError,
  InvalidLinkIdError,
  InvalidLinkOwnerError,
  InvalidLinkSourceIdError,
  InvalidLinkTargetError,
  InvalidLinkTitleError,
  InvalidLinkUriError,
} from './exceptions'
import type { LinkTarget } from './model'
import { LINK_URI_PATTERN, MAX_LINK_URI_LENGTH } from './schema'

/** UUID v4 любого регистра — все id (ссылки, источники, цели) генерирует backend. */
const LINK_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const MAX_LINK_TITLE_LENGTH = 200
export const MAX_LINK_DESCRIPTION_LENGTH = 2000

type EntityError = new (message: string) => Error

function validateLinkUuid(value: string, error: EntityError, label: string): string {
  const normalized = value.trim()
  if (!LINK_UUID_PATTERN.test(normalized)) throw new error(`${label} должен быть UUID: «${value}»`)

  return normalized
}

export const validateLinkId = (value: string) =>
  validateLinkUuid(value, InvalidLinkIdError, 'Идентификатор ссылки')
export const validateLinkSourceId = (value: string) =>
  validateLinkUuid(value, InvalidLinkSourceIdError, 'Идентификатор источника')

export const validateLinkOwnerPluginId = (value: string): string => {
  const normalized = value.trim()
  if (!normalized) throw new InvalidLinkOwnerError('Плагин-владелец ссылки не может быть пустым')

  return normalized
}

function validateOptionalText(
  value: string | null,
  maxLength: number,
  error: EntityError,
  label: string,
): string | null {
  if (value === null) return null
  const normalized = value.trim()
  if (normalized.length > maxLength)
    throw new error(`${label} ссылки не может быть длиннее ${maxLength} символов`)

  return normalized
}

export const validateLinkTitle = (value: string | null) =>
  validateOptionalText(value, MAX_LINK_TITLE_LENGTH, InvalidLinkTitleError, 'Заголовок')
export const validateLinkDescription = (value: string | null) =>
  validateOptionalText(value, MAX_LINK_DESCRIPTION_LENGTH, InvalidLinkDescriptionError, 'Описание')

export function validateLinkUri(uri: string): string {
  const normalized = uri.trim()
  if (!normalized || normalized.length > MAX_LINK_URI_LENGTH || !LINK_URI_PATTERN.test(normalized))
    throw new InvalidLinkUriError(`URI ссылки некорректен: «${uri}»`)

  return normalized
}

/** Проверяет цель зеркально backend-правилам; возвращает нормализованную копию. */
export function validateLinkTarget(target: LinkTarget): LinkTarget {
  switch (target.kind) {
    case 'course':
      return {
        kind: 'course',
        courseId: validateLinkUuid(target.courseId, InvalidLinkTargetError, 'Курс в цели ссылки'),
      }
    case 'resource':
      return {
        kind: 'resource',
        courseId: validateLinkUuid(target.courseId, InvalidLinkTargetError, 'Курс в цели ссылки'),
        resourceId: validateLinkUuid(
          target.resourceId,
          InvalidLinkTargetError,
          'Ресурс в цели ссылки',
        ),
      }
    case 'uri':
      return { kind: 'uri', uri: validateLinkUri(target.uri) }
  }
}
