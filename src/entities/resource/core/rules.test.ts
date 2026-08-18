import { describe, expect, it } from 'vitest'
import { InvalidResourceTypeExtensionError, InvalidResourceTypeKeyError } from './exceptions'
import {
  validateResourceTypeExtensions,
  validateResourceTypeKey,
  validateResourceTypeName,
} from './rules'

describe('resource rules', () => {
  it('normalizes type fields and extensions', () => {
    expect(validateResourceTypeKey('  theory  ')).toBe('theory')
    expect(validateResourceTypeName('  Теория  ')).toBe('Теория')
    expect(validateResourceTypeExtensions([' .md ', '.txt'])).toEqual(['.md', '.txt'])
  })

  it('rejects invalid keys and extensions', () => {
    expect(() => validateResourceTypeKey('')).toThrow(InvalidResourceTypeKeyError)
    expect(() => validateResourceTypeExtensions(['md'])).toThrow(InvalidResourceTypeExtensionError)
  })
})
