import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendCreateCourse } from '../api/create'
import { createCourse } from './create'

vi.mock('../api/create', () => ({ sendCreateCourse: vi.fn() }))

const invokeCreate = vi.mocked(sendCreateCourse)
const course = { id: 'course-1', name: 'Математика', description: null, createdAt: 1, updatedAt: 1 }

describe('course create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('validates, normalizes and sends input', async () => {
    invokeCreate.mockResolvedValue(course)

    await expect(createCourse({ name: '  Математика  ', description: '  ' })).resolves.toEqual(
      course,
    )
    expect(invokeCreate).toHaveBeenCalledWith({ name: 'Математика', description: null })
  })

  it('does not call API for invalid input', async () => {
    await expect(createCourse({ name: 'x', description: null })).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })
})
