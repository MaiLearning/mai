import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendCreateDirectory } from '../api/create'
import { createDirectory } from './create'

vi.mock('../api/create', () => ({ sendCreateDirectory: vi.fn() }))

const invokeCreate = vi.mocked(sendCreateDirectory)
const node = {
  id: 'dir-1',
  courseId: 'course-1',
  name: 'Раздел',
  parentId: null,
  position: 0,
  isDirectory: true,
  resource: null,
  directoryId: 'dir-1',
}

describe('directory create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('normalizes fields and passes null parent, validating node contract', async () => {
    invokeCreate.mockResolvedValue(node)

    await expect(
      createDirectory({ courseId: ' course-1 ', name: ' Раздел ', parentId: null }),
    ).resolves.toEqual(node)
    expect(invokeCreate).toHaveBeenCalledWith('course-1', 'Раздел', null)
  })

  it('rejects invalid course ID before API call', async () => {
    await expect(
      createDirectory({ courseId: ' ', name: 'Раздел', parentId: null }),
    ).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })
})
