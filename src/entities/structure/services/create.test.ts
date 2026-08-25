import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendCreateResource } from '../api/create'
import { createResourceInStructure } from './create'

vi.mock('../api/create', () => ({ sendCreateResource: vi.fn() }))

const invokeCreate = vi.mocked(sendCreateResource)

const node = {
  id: 'node-1',
  courseId: 'course-1',
  parentId: null,
  position: 0,
  isDirectory: false,
  resource: null,
  directoryId: null,
  name: 'Тема',
}

describe('structure create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('normalizes optional hierarchy fields', async () => {
    invokeCreate.mockResolvedValue(node)

    await expect(
      createResourceInStructure({
        courseId: ' course-1 ',
        name: ' Тема ',
        parentId: null,
        typeKey: null,
      }),
    ).resolves.toEqual(node)
    expect(invokeCreate).toHaveBeenCalledWith('course-1', 'Тема', null, null)
  })

  it('rejects invalid resource name before API call', async () => {
    await expect(
      createResourceInStructure({ courseId: 'course-1', name: ' ', parentId: null, typeKey: null }),
    ).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })
})
