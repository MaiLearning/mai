import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Course } from '../core/model'
import { fetchAllCourses, fetchCourseById } from '../services/fetch'
import { coursesAtom, coursesByIdAtom, selectedCourseIdAtom } from './atoms'
import { applyCourseChangeAtom } from './sync'

vi.mock('@tauri-apps/plugin-log', () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
}))
vi.mock('../services/fetch', () => ({
  fetchAllCourses: vi.fn(),
  fetchCourseById: vi.fn(),
}))

const invokeFetchAll = vi.mocked(fetchAllCourses)
const invokeFetchById = vi.mocked(fetchCourseById)

const courseA: Course = {
  id: 'course-a',
  name: 'Курс A',
  description: null,
  tags: [],
  colorFrom: null,
  colorTo: null,
  status: 'draft',
  createdAt: 1,
  updatedAt: 1,
}
const courseB: Course = { ...courseA, id: 'course-b', name: 'Курс B' }
const renamedA: Course = { ...courseA, name: 'Курс A (обновлён)', updatedAt: 2 }

const httpEvent = {
  entity: 'course',
  id: courseA.id,
  courseId: null,
  origin: 'http',
  timestamp: 1756800000000,
} as const

describe('applyCourseChangeAtom', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    invokeFetchAll.mockReset()
    invokeFetchById.mockReset()
  })

  it('deleted удаляет курс из списков, кэша и сбрасывает selectedCourseIdAtom', async () => {
    store.set(coursesAtom, [courseA, courseB])
    store.set(coursesByIdAtom, { [courseA.id]: courseA, [courseB.id]: courseB })
    store.set(selectedCourseIdAtom, courseA.id)

    await store.set(applyCourseChangeAtom, { ...httpEvent, action: 'deleted' })

    expect(store.get(coursesAtom)).toEqual([courseB])
    expect(store.get(coursesByIdAtom)).toEqual({ [courseB.id]: courseB })
    expect(store.get(selectedCourseIdAtom)).toBeNull()
  })

  it('deleted другого курса не сбрасывает selectedCourseIdAtom', async () => {
    store.set(coursesAtom, [courseA, courseB])
    store.set(coursesByIdAtom, {})
    store.set(selectedCourseIdAtom, courseB.id)

    await store.set(applyCourseChangeAtom, { ...httpEvent, action: 'deleted' })

    expect(store.get(selectedCourseIdAtom)).toBe(courseB.id)
  })

  it('updated перечитывает список и точечный кэш для знакомого id', async () => {
    store.set(coursesAtom, [courseA])
    store.set(coursesByIdAtom, { [courseA.id]: courseA })
    invokeFetchAll.mockResolvedValue([renamedA, courseB])
    invokeFetchById.mockResolvedValue(renamedA)

    await store.set(applyCourseChangeAtom, { ...httpEvent, action: 'updated' })

    expect(store.get(coursesAtom)).toEqual([renamedA, courseB])
    expect(store.get(coursesByIdAtom)).toEqual({ [courseA.id]: renamedA })
    expect(invokeFetchById).toHaveBeenCalledWith(courseA.id)
  })

  it('created не трогает точечный кэш для незнакомого id', async () => {
    store.set(coursesAtom, [])
    store.set(coursesByIdAtom, {})
    invokeFetchAll.mockResolvedValue([courseB])

    await store.set(applyCourseChangeAtom, { ...httpEvent, action: 'created' })

    expect(store.get(coursesAtom)).toEqual([courseB])
    expect(invokeFetchById).not.toHaveBeenCalled()
  })

  it('ошибка refetch не выпадает наружу, а логируется warn', async () => {
    const { warn } = await import('@tauri-apps/plugin-log')
    invokeFetchAll.mockRejectedValue(new Error('boom'))

    await store.set(applyCourseChangeAtom, { ...httpEvent, action: 'updated' })

    expect(warn).toHaveBeenCalledTimes(1)
  })
})
