import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendUpdateCourse } from '../api/update'
import type { Course } from '../core/model'
import { updateCourse } from './update'

vi.mock('../api/update', () => ({ sendUpdateCourse: vi.fn() }))

const invokeUpdate = vi.mocked(sendUpdateCourse)
const course: Course = {
  id: 'course-1',
  name: 'Математика',
  description: null,
  tags: [],
  colorFrom: null,
  colorTo: null,
  status: 'draft',
  createdAt: 1,
  updatedAt: 1,
}

describe('course update service', () => {
  beforeEach(() => invokeUpdate.mockReset())

  it('validates, normalizes and sends input', async () => {
    invokeUpdate.mockResolvedValue(course)

    await expect(
      updateCourse({
        id: ' course-1 ',
        name: '  Математика  ',
        description: '  ',
        tags: [],
        colorFrom: null,
        colorTo: null,
        status: 'draft',
      }),
    ).resolves.toEqual(course)
    expect(invokeUpdate).toHaveBeenCalledWith({
      id: 'course-1',
      name: 'Математика',
      description: null,
      tags: [],
      colorFrom: null,
      colorTo: null,
      status: 'draft',
    })
  })

  it('passes meta fields and normalizes colors', async () => {
    invokeUpdate.mockResolvedValue({ ...course, status: 'completed' })
    await updateCourse({
      id: 'course-1',
      name: 'Математика',
      description: null,
      tags: [' Алгебра ', 'геометрия', 'АЛГЕБРА'],
      colorFrom: '#6A54FF',
      colorTo: '#9d7bff',
      status: 'completed',
    })
    expect(invokeUpdate).toHaveBeenCalledWith({
      id: 'course-1',
      name: 'Математика',
      description: null,
      tags: ['Алгебра', 'геометрия'],
      colorFrom: '#6a54ff',
      colorTo: '#9d7bff',
      status: 'completed',
    })
  })

  it('does not call API for invalid input', async () => {
    await expect(
      updateCourse({
        id: 'course-1',
        name: 'x',
        description: null,
        tags: [],
        colorFrom: null,
        colorTo: null,
        status: 'draft',
      }),
    ).rejects.toThrow()
    await expect(
      updateCourse({
        id: 'course-1',
        name: 'Математика',
        description: null,
        tags: [],
        colorFrom: null,
        colorTo: null,
        status: 'unknown' as Course['status'],
      }),
    ).rejects.toThrow()
    expect(invokeUpdate).not.toHaveBeenCalled()
  })
})
