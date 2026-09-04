import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendCreateLink } from '../api/create'
import type { Link } from '../core/model'
import { createLink } from './create'

vi.mock('../api/create', () => ({ sendCreateLink: vi.fn() }))

const invokeCreate = vi.mocked(sendCreateLink)

const UUID = '01234567-89ab-4cde-8f01-23456789abcd'

const link = {
  id: UUID,
  sourceType: 'course',
  sourceId: UUID,
  target: { kind: 'resource', courseId: UUID, resourceId: UUID },
  ownerPluginId: 'internal-link',
  title: 'Справочник',
  description: null,
  createdAt: 1756800000000,
  updatedAt: 1756800000000,
  targetStatus: 'ok',
} as const

describe('link create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('нормализует поля и валидирует wire-контракт ответа', async () => {
    invokeCreate.mockResolvedValue(link)

    await expect(
      createLink({
        sourceType: 'course',
        sourceId: ` ${UUID} `,
        target: { kind: 'resource', courseId: UUID, resourceId: UUID },
        ownerPluginId: ' internal-link ',
        title: ' Справочник ',
      }),
    ).resolves.toEqual(link)
    expect(invokeCreate).toHaveBeenCalledWith({
      sourceType: 'course',
      sourceId: UUID,
      target: { kind: 'resource', courseId: UUID, resourceId: UUID },
      ownerPluginId: 'internal-link',
      title: 'Справочник',
      description: null,
    })
  })

  it('отвергает не-UUID источник до обращения к api', async () => {
    await expect(
      createLink({
        sourceType: 'course',
        sourceId: 'not-a-uuid',
        target: { kind: 'uri', uri: 'https://example.com' },
        ownerPluginId: 'internal-link',
      }),
    ).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })

  it('отвергает битый ответ api', async () => {
    invokeCreate.mockResolvedValue({ ...link, targetStatus: 'unknown' } as unknown as Link)

    await expect(
      createLink({
        sourceType: 'course',
        sourceId: UUID,
        target: { kind: 'uri', uri: 'https://example.com' },
        ownerPluginId: 'internal-link',
      }),
    ).rejects.toThrow()
  })
})
