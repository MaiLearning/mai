import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendFetchPluginSettings, sendUpdatePluginSettings } from '../api/plugin'
import { fetchPluginSettings, updatePluginSettings } from './plugin'

vi.mock('../api/plugin', () => ({
  sendFetchPluginSettings: vi.fn(),
  sendUpdatePluginSettings: vi.fn(),
}))

const sendFetch = vi.mocked(sendFetchPluginSettings)
const sendUpdate = vi.mocked(sendUpdatePluginSettings)

describe('plugin settings services', () => {
  beforeEach(() => {
    sendFetch.mockReset()
    sendUpdate.mockReset()
  })

  it('fetches and validates plugin settings', async () => {
    sendFetch.mockResolvedValue({ 'editor.fontSize': 14 })

    await expect(fetchPluginSettings('demo')).resolves.toEqual({
      'editor.fontSize': 14,
    })
  })

  it('rejects invalid plugin id', async () => {
    await expect(fetchPluginSettings('')).rejects.toThrow()
    expect(sendFetch).not.toHaveBeenCalled()
  })

  it('saves settings with full map replacement', async () => {
    sendUpdate.mockResolvedValue({ autosave: true, timeout: 30 })

    await expect(updatePluginSettings('demo', { autosave: true })).resolves.toEqual({
      autosave: true,
      timeout: 30,
    })
    expect(sendUpdate).toHaveBeenCalledWith('demo', { autosave: true })
  })
})
