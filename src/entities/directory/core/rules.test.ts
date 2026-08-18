import { describe, expect, it } from 'vitest'
import { InvalidDirectoryNameError } from './exceptions'
import { validateDirectoryCourseId, validateDirectoryName } from './rules'

describe('directory rules', () => {
  it('trims identifiers and names', () => {
    expect(validateDirectoryCourseId(' course-1 ')).toBe('course-1')
    expect(validateDirectoryName('  Раздел  ')).toBe('Раздел')
  })

  it('rejects empty names', () => {
    expect(() => validateDirectoryName('  ')).toThrow(InvalidDirectoryNameError)
  })
})
