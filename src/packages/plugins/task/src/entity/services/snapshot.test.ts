import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTaskSnapshot as invokeSnapshot } from '../api/snapshot'
import type { TaskSnapshotData } from '../core/model'
import { fetchTaskSnapshot } from './snapshot'

vi.mock('../api/snapshot', () => ({ fetchTaskSnapshot: vi.fn() }))

const invokeSnapshotMock = vi.mocked(invokeSnapshot)

const snapshot: TaskSnapshotData = {
  resourceId: 'r1',
  content: {
    tasks: [{ id: 't1', prompt: 'Вопрос?', difficulty: 'easy', kind: 'TrueFalse', answer: true }],
    difficulties: [],
    answers: {},
    results: {},
    completed: {},
  },
  createdAt: 1,
  updatedAt: 2,
}

describe('task snapshot service', () => {
  beforeEach(() => invokeSnapshotMock.mockReset())

  it('валидирует снапшот backend и возвращает его', async () => {
    invokeSnapshotMock.mockResolvedValue(snapshot)

    await expect(fetchTaskSnapshot('r1')).resolves.toEqual(snapshot)
    expect(invokeSnapshotMock).toHaveBeenCalledWith('r1')
  })

  it('отклоняет битый снапшот (неизвестный тип задачи)', async () => {
    invokeSnapshotMock.mockResolvedValue({
      ...snapshot,
      content: { ...snapshot.content, tasks: [{ ...snapshot.content.tasks[0], kind: 'Puzzle' }] },
    } as unknown as TaskSnapshotData)

    await expect(fetchTaskSnapshot('r1')).rejects.toThrow()
  })
})
