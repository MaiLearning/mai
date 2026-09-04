import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendDeleteLink } from '../api/delete'
import { deleteLink } from './delete'

vi.mock('../api/delete', () => ({ sendDeleteLink: vi.fn() }))

const invokeDelete = vi.mocked(sendDeleteLink)

const UUID = '01234567-89ab-4cde-8f01-23456789abcd'

describe('link delete service', () => {
  beforeEach(() => invokeDelete.mockReset())

  it('передаёт нормализованные аргументы', async () => {
    invokeDelete.mockResolvedValue(undefined)

    await expect(deleteLink(` ${UUID} `, ' internal-link ')).resolves.toBeUndefined()
    expect(invokeDelete).toHaveBeenCalledWith(UUID, 'internal-link')
  })

  it('отвергает пустого владельца до обращения к api', async () => {
    await expect(deleteLink(UUID, '  ')).rejects.toThrow()
    expect(invokeDelete).not.toHaveBeenCalled()
  })
})
