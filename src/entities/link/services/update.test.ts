import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendUpdateLink } from '../api/update'
import { updateLink } from './update'

vi.mock('../api/update', () => ({ sendUpdateLink: vi.fn() }))

const invokeUpdate = vi.mocked(sendUpdateLink)

const UUID = '01234567-89ab-4cde-8f01-23456789abcd'

const link = {
  id: UUID,
  sourceType: 'course',
  sourceId: UUID,
  target: { kind: 'course', courseId: UUID },
  ownerPluginId: 'internal-link',
  title: null,
  description: null,
  createdAt: 1756800000000,
  updatedAt: 1756800000001,
  targetStatus: 'ok',
} as const

describe('link update service', () => {
  beforeEach(() => invokeUpdate.mockReset())

  it('не затирает незаданные поля и валидирует ответ', async () => {
    invokeUpdate.mockResolvedValue(link)

    await expect(
      updateLink({ id: UUID, ownerPluginId: 'internal-link', title: null }),
    ).resolves.toEqual(link)
    expect(invokeUpdate).toHaveBeenCalledWith({
      id: UUID,
      ownerPluginId: 'internal-link',
      title: null,
    })
  })

  it('валидирует цель и URI до обращения к api', async () => {
    await expect(
      updateLink({
        id: UUID,
        ownerPluginId: 'internal-link',
        target: { kind: 'uri', uri: 'bad-uri' },
      }),
    ).rejects.toThrow()
    expect(invokeUpdate).not.toHaveBeenCalled()
  })
})
