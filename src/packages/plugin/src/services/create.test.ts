import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendRegisterInternalPlugin } from '../api/create'
import { registerInternalPlugin } from './create'

vi.mock('../api/create', () => ({
  sendRegisterPlugin: vi.fn(),
  sendRegisterInternalPlugin: vi.fn(),
}))

const invokeRegister = vi.mocked(sendRegisterInternalPlugin)

const plugin = {
  id: 'plugin-1',
  name: 'Теория',
  author: null,
  description: null,
  version: '1.0.0',
  enabled: true,
  kind: 'internal' as const,
  installedAt: 1,
  updatedAt: 1,
}

describe('internal plugin create service', () => {
  beforeEach(() => invokeRegister.mockReset())

  it('normalizes plugin fields and validates response', async () => {
    invokeRegister.mockResolvedValue(plugin)

    await expect(
      registerInternalPlugin({
        id: ' plugin-1 ',
        name: ' Теория ',
        version: ' 1.0.0 ',
        description: null,
        author: null,
      }),
    ).resolves.toEqual(plugin)
    expect(invokeRegister).toHaveBeenCalledWith({
      id: 'plugin-1',
      name: 'Теория',
      version: '1.0.0',
      description: null,
      author: null,
    })
  })

  it('rejects invalid plugin ID before API call', async () => {
    await expect(
      registerInternalPlugin({
        id: ' ',
        name: 'Теория',
        version: '1.0.0',
        description: null,
        author: null,
      }),
    ).rejects.toThrow()
    expect(invokeRegister).not.toHaveBeenCalled()
  })
})
