import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendFetchSettings } from '../api/fetch'
import { sendUpdateSettings } from '../api/update'
import type { UpdateSettingsInput } from '../core/model'
import { updateSettings } from './update'

vi.mock('../api/fetch', () => ({ sendFetchSettings: vi.fn() }))
vi.mock('../api/update', () => ({ sendUpdateSettings: vi.fn() }))

const sendFetch = vi.mocked(sendFetchSettings)
const sendUpdate = vi.mocked(sendUpdateSettings)

describe('settings update service', () => {
  beforeEach(() => {
    sendFetch.mockReset()
    sendUpdate.mockReset()
  })

  it('merges patch with current settings and saves the whole value', async () => {
    sendFetch.mockResolvedValue({ theme: 'system', language: 'ru' })
    sendUpdate.mockResolvedValue({ theme: 'dark', language: 'ru' })

    await expect(updateSettings({ theme: 'dark' })).resolves.toEqual({
      theme: 'dark',
      language: 'ru',
    })
    expect(sendUpdate).toHaveBeenCalledWith({ theme: 'dark', language: 'ru' })
  })

  it('rejects invalid patch without saving', async () => {
    await expect(
      updateSettings({ theme: 'pink' } as unknown as UpdateSettingsInput),
    ).rejects.toThrow()
    expect(sendUpdate).not.toHaveBeenCalled()
  })
})
