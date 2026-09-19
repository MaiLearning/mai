import { describe, expect, it } from 'vitest'
import {
  InvalidCourseColorError,
  InvalidCourseNameError,
  InvalidCourseStatusError,
  InvalidCourseTagsError,
  InvalidCourseTimelineError,
} from './exceptions'
import {
  validateCourseColor,
  validateCourseDescription,
  validateCourseName,
  validateCourseStatus,
  validateCourseTags,
  validateCourseTimeline,
} from './rules'

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

  it('normalizes tags', () => {
    expect(validateCourseTags(['  Алгебра  ', ' Геометрия '])).toEqual(['Алгебра', 'Геометрия'])
    expect(validateCourseTags([])).toEqual([])
    expect(validateCourseTags(['   ', ''])).toEqual([])
    // дубли без учёта регистра снимаются
    expect(validateCourseTags(['Frontend', 'frontend', 'FRONTEND'])).toEqual(['Frontend'])
  })

  it('rejects too long tags but allows many tags', () => {
    expect(() => validateCourseTags(['т'.repeat(33)])).toThrow(InvalidCourseTagsError)
    expect(validateCourseTags(Array.from({ length: 20 }, (_, i) => `тег-${i + 1}`))).toHaveLength(
      20,
    )
  })

  it('validates color format', () => {
    expect(validateCourseColor('#6A54FF')).toBe('#6a54ff')
    expect(validateCourseColor(null)).toBeNull()
    expect(validateCourseColor('   ')).toBeNull()
    expect(() => validateCourseColor('6a54ff')).toThrow(InvalidCourseColorError)
    expect(() => validateCourseColor('#6a54f')).toThrow(InvalidCourseColorError)
    expect(() => validateCourseColor('#zzzzzz')).toThrow(InvalidCourseColorError)
  })

  it('validates status values', () => {
    expect(validateCourseStatus('draft')).toBe('draft')
    expect(validateCourseStatus(' IN_PROGRESS ')).toBe('in_progress')
    expect(() => validateCourseStatus('archived')).toThrow(InvalidCourseStatusError)
  })
})
