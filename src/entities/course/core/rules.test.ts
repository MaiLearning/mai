import { describe, expect, it } from 'vitest'
import { InvalidCourseNameError, InvalidCourseTimelineError } from './exceptions'
import { validateCourseDescription, validateCourseName, validateCourseTimeline } from './rules'

describe('course rules', () => {
  it('normalizes name and description', () => {
    expect(validateCourseName('  Математика  ')).toBe('Математика')
    expect(validateCourseDescription('  Основы  ')).toBe('Основы')
    expect(validateCourseDescription('   ')).toBeNull()
  })

  it('rejects short names and invalid timeline', () => {
    expect(() => validateCourseName('ab')).toThrow(InvalidCourseNameError)
    expect(() => validateCourseTimeline(10, 9)).toThrow(InvalidCourseTimelineError)
  })
})
