import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendKvGet } from '../api/get'
import { getKvValue } from './get'

vi.mock('../api/get', () => ({ sendKvGet: vi.fn() }))

const invokeGet = vi.mocked(sendKvGet)

describe('getKvValue', () => {
  beforeEach(() => invokeGet.mockReset())

  it('returns value for existing key', async () => {
    invokeGet.mockResolvedValue('course-1')
    await expect(getKvValue<string>('course.last_opened_id')).resolves.toBe('course-1')
    expect(invokeGet).toHaveBeenCalledWith('course.last_opened_id')
  })

  it('returns null for missing key', async () => {
    invokeGet.mockResolvedValue(null)
    await expect(getKvValue<string>('course.last_opened_id')).resolves.toBeNull()
  })

  it('does not call API for invalid key', async () => {
    await expect(getKvValue('bad key!')).rejects.toThrow()
    expect(invokeGet).not.toHaveBeenCalled()
  })
})
