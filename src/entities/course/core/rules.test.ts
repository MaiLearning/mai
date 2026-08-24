import { describe, expect, it } from 'vitest'
import {
  InvalidCourseColorError,
  InvalidCourseNameError,
  InvalidCourseStatusError,
  InvalidCourseTimelineError,
  InvalidCourseTopicError,
} from './exceptions'
import {
  validateCourseColor,
  validateCourseDescription,
  validateCourseName,
  validateCourseStatus,
  validateCourseTimeline,
  validateCourseTopic,
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

  it('normalizes topic', () => {
    expect(validateCourseTopic('  Алгебра  ')).toBe('Алгебра')
    expect(validateCourseTopic(null)).toBeNull()
    expect(validateCourseTopic('   ')).toBeNull()
    expect(() => validateCourseTopic('т'.repeat(81))).toThrow(InvalidCourseTopicError)
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
