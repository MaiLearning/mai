import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendCreateCourse } from '../api/create'
import type { Course } from '../core/model'
import { createCourse } from './create'

vi.mock('../api/create', () => ({ sendCreateCourse: vi.fn() }))

const invokeCreate = vi.mocked(sendCreateCourse)
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

describe('course create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('validates, normalizes and sends input', async () => {
    invokeCreate.mockResolvedValue(course)

    await expect(createCourse({ name: '  Математика  ', description: '  ' })).resolves.toEqual(
      course,
    )
    expect(invokeCreate).toHaveBeenCalledWith({
      name: 'Математика',
      description: null,
      tags: [],
      colorFrom: null,
      colorTo: null,
      status: 'draft',
    })
  })

  it('passes meta fields and defaults status', async () => {
    invokeCreate.mockResolvedValue(course)
    await createCourse({
      name: 'Математика',
      description: null,
      tags: [' Алгебра ', 'геометрия', 'АЛГЕБРА'],
      colorFrom: '#6A54FF',
      colorTo: '#9d7bff',
      status: 'in_progress',
    })
    expect(invokeCreate).toHaveBeenCalledWith({
      name: 'Математика',
      description: null,
      tags: ['Алгебра', 'геометрия'],
      colorFrom: '#6a54ff',
      colorTo: '#9d7bff',
      status: 'in_progress',
    })
  })

  it('does not call API for invalid input', async () => {
    await expect(createCourse({ name: 'x', description: null })).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })
})
