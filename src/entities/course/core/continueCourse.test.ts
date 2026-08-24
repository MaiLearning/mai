import { describe, expect, it } from 'vitest'
import type { Course } from './model'
import { resolveContinueCourse } from './continueCourse'

function makeCourse(overrides: Partial<Course> & Pick<Course, 'id'>): Course {
  return {
    name: overrides.id,
    description: null,
    topic: null,
    colorFrom: null,
    colorTo: null,
    status: 'draft',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

const fresh = makeCourse({ id: 'fresh', status: 'draft', updatedAt: 300 })
const progress = makeCourse({ id: 'progress', status: 'in_progress', updatedAt: 200 })
const done = makeCourse({ id: 'done', status: 'completed', updatedAt: 100 })

describe('resolveContinueCourse', () => {
  it('returns null for empty list', () => {
    expect(resolveContinueCourse([], null)).toBeNull()
  })

  it('prefers last opened course regardless of status', () => {
    const courses = [progress, done]
    expect(resolveContinueCourse(courses, 'done')).toBe(done)
    expect(resolveContinueCourse(courses, 'progress')).toBe(progress)
  })

  it('falls back to freshest in_progress when no last opened', () => {
    expect(resolveContinueCourse([fresh, progress], null)).toBe(progress)
  })

  it('falls back to freshest course when no in_progress', () => {
    expect(resolveContinueCourse([fresh, done], null)).toBe(fresh)
  })

  it('falls back to freshness when last opened course was deleted', () => {
    expect(resolveContinueCourse([fresh, progress], 'deleted-id')).toBe(progress)
  })
})
