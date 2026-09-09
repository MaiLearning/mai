import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendFetchSettings } from '../api/fetch'
import { fetchSettings } from './fetch'

vi.mock('../api/fetch', () => ({ sendFetchSettings: vi.fn() }))

const sendFetch = vi.mocked(sendFetchSettings)

describe('settings fetch service', () => {
  beforeEach(() => sendFetch.mockReset())

  it('validates api response with schema', async () => {
    sendFetch.mockResolvedValue({ theme: 'dark', language: 'en' })

    await expect(fetchSettings()).resolves.toEqual({ theme: 'dark', language: 'en' })
  })

  it('rejects on invalid api response', async () => {
    sendFetch.mockResolvedValue({ theme: 'pink' } as unknown as Awaited<
      ReturnType<typeof sendFetchSettings>
    >)

    await expect(fetchSettings()).rejects.toThrow()
  })
})
