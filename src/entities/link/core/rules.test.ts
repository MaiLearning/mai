import { describe, expect, it } from 'vitest'
import {
  InvalidLinkOwnerError,
  InvalidLinkSourceIdError,
  InvalidLinkTargetError,
  InvalidLinkTitleError,
  InvalidLinkUriError,
} from './exceptions'
import {
  validateLinkOwnerPluginId,
  validateLinkSourceId,
  validateLinkTarget,
  validateLinkTitle,
  validateLinkUri,
} from './rules'

const UUID = '01234567-89ab-4cde-8f01-23456789abcd'

describe('link rules', () => {
  it('обрезает идентификаторы и владельца', () => {
    expect(validateLinkSourceId(` ${UUID} `)).toBe(UUID)
    expect(validateLinkOwnerPluginId(' internal-link ')).toBe('internal-link')
  })

  it('отвергает не-UUID источник', () => {
    expect(() => validateLinkSourceId('not-a-uuid')).toThrow(InvalidLinkSourceIdError)
  })

  it('отвергает пустого владельца', () => {
    expect(() => validateLinkOwnerPluginId('  ')).toThrow(InvalidLinkOwnerError)
  })

  it('принимает null-заголовок, но отвергает слишком длинный', () => {
    expect(validateLinkTitle(null)).toBeNull()
    expect(() => validateLinkTitle('x'.repeat(201))).toThrow(InvalidLinkTitleError)
  })

  it('проверяет схему и длину URI', () => {
    expect(validateLinkUri('https://example.com')).toBe('https://example.com')
    expect(() => validateLinkUri('example.com/no-scheme')).toThrow(InvalidLinkUriError)
    expect(() => validateLinkUri(`https://${'a'.repeat(2048)}`)).toThrow(InvalidLinkUriError)
  })

  it('валидирует все виды цели', () => {
    expect(validateLinkTarget({ kind: 'course', courseId: UUID })).toEqual({
      kind: 'course',
      courseId: UUID,
    })
    expect(validateLinkTarget({ kind: 'resource', courseId: UUID, resourceId: UUID })).toEqual({
      kind: 'resource',
      courseId: UUID,
      resourceId: UUID,
    })
    expect(validateLinkTarget({ kind: 'uri', uri: 'mai:course/x' })).toEqual({
      kind: 'uri',
      uri: 'mai:course/x',
    })
    expect(() => validateLinkTarget({ kind: 'course', courseId: 'bad' })).toThrow(
      InvalidLinkTargetError,
    )
  })
})
