import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendKvSet } from '../api/set'
import type { KvEntry } from '../core/model'
import { setKvValue } from './set'

vi.mock('../api/set', () => ({ sendKvSet: vi.fn() }))

const invokeSet = vi.mocked(sendKvSet)

const entry: KvEntry = { key: 'k', value: 'v', createdAt: 1, updatedAt: 1 }

describe('setKvValue', () => {
  beforeEach(() => invokeSet.mockReset())

  it('sends key and value', async () => {
    invokeSet.mockResolvedValue(entry)
    await setKvValue('k', 'v')
    expect(invokeSet).toHaveBeenCalledWith('k', 'v')
  })

  it('does not call API for invalid key', async () => {
    await expect(setKvValue('bad key!', 'v')).rejects.toThrow()
    expect(invokeSet).not.toHaveBeenCalled()
  })

  it('throws on invalid entry from backend', async () => {
    invokeSet.mockResolvedValue({ key: 'k' } as unknown as KvEntry)
    await expect(setKvValue('k', 'v')).rejects.toThrow()
  })
})
