import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendSetTaskDifficulties } from '../api/difficulties'
import { setTaskDifficulties } from './difficulties'

vi.mock('../api/difficulties', () => ({ sendSetTaskDifficulties: vi.fn() }))

const invokeSetDifficulties = vi.mocked(sendSetTaskDifficulties)

describe('task difficulties service', () => {
  beforeEach(() => invokeSetDifficulties.mockReset())

  it('валидирует вход и уходит в API', async () => {
    const difficulties = [{ id: 'd-1', label: 'Дьявольская', color: '#ff0044' }]

    await setTaskDifficulties({ resourceId: 'r1', difficulties })

    expect(invokeSetDifficulties).toHaveBeenCalledWith('r1', difficulties)
  })

  it('отклоняет сложность без цвета без вызова API', async () => {
    await expect(
      setTaskDifficulties({ resourceId: 'r1', difficulties: [{ id: 'd-1', label: 'x' } as never] }),
    ).rejects.toThrow()
    expect(invokeSetDifficulties).not.toHaveBeenCalled()
  })
})
