import { beforeEach, describe, expect, it, vi } from 'vitest'
import { listCourseLinks } from '../api/fetch'
import type { Link } from '../core/model'
import { fetchCourseLinks } from './fetch'

vi.mock('../api/fetch', () => ({ listCourseLinks: vi.fn() }))

const invokeList = vi.mocked(listCourseLinks)

const UUID = '01234567-89ab-4cde-8f01-23456789abcd'

const link = {
  id: UUID,
  sourceType: 'course',
  sourceId: UUID,
  target: { kind: 'course', courseId: UUID },
  ownerPluginId: 'internal-link',
  title: null,
  description: null,
  createdAt: 1756800000000,
  updatedAt: 1756800000000,
  targetStatus: 'ok',
} as const

describe('link fetch service', () => {
  beforeEach(() => invokeList.mockReset())

  it('валидирует ответ через Zod-схему', async () => {
    invokeList.mockResolvedValue([link])

    await expect(fetchCourseLinks(UUID)).resolves.toEqual([link])
  })

  it('отвергает payload, не соответствующий контракту', async () => {
    invokeList.mockResolvedValue([{ id: 'broken' }] as unknown as Link[])

    await expect(fetchCourseLinks(UUID)).rejects.toThrow()
  })
})
