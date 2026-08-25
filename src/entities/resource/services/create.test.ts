import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendCreateResourceType } from '../api/create'
import { createResourceType } from './create'

vi.mock('../api/create', () => ({ sendCreateResourceType: vi.fn() }))

const invokeCreate = vi.mocked(sendCreateResourceType)

const resourceType = {
  key: 'theory',
  name: 'Теория',
  description: null,
  pluginId: null,
  supportedExtensions: ['.md'],
  createdAt: 1,
  updatedAt: 1,
}

describe('resource type create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('normalizes type data before API call', async () => {
    invokeCreate.mockResolvedValue(resourceType)

    await expect(
      createResourceType({
        key: ' theory ',
        name: ' Теория ',
        description: null,
        pluginId: null,
        supportedExtensions: [' .md '],
      }),
    ).resolves.toEqual(resourceType)
    expect(invokeCreate).toHaveBeenCalledWith({
      key: 'theory',
      name: 'Теория',
      description: null,
      pluginId: null,
      supportedExtensions: ['.md'],
    })
  })

  it('rejects invalid extension before API call', async () => {
    await expect(
      createResourceType({
        key: 'theory',
        name: 'Теория',
        description: null,
        pluginId: null,
        supportedExtensions: ['md'],
      }),
    ).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })
})
