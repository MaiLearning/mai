import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCodeContent as invokeSnapshot } from '../api/snapshot'
import type { CodeContentData } from '../core/model'
import { fetchCodeContentSnapshot } from './snapshot'

vi.mock('../api/snapshot', () => ({ fetchCodeContent: vi.fn() }))

const invokeSnapshotMock = vi.mocked(invokeSnapshot)

const snapshot: CodeContentData = {
  resourceId: 'r1',
  content: {
    language: 'python',
    steps: [
      {
        id: 's1',
        title: 'Первый шаг',
        instructions: '',
        starterCode: 'print()',
        expectedOutput: 'hello',
      },
    ],
    code: { s1: 'print("hello")' },
    results: { s1: 'passed' },
  },
  createdAt: 1,
  updatedAt: 2,
}

describe('code snapshot service', () => {
  beforeEach(() => invokeSnapshotMock.mockReset())

  it('валидирует снапшот backend и возвращает его', async () => {
    invokeSnapshotMock.mockResolvedValue(snapshot)

    await expect(fetchCodeContentSnapshot('r1')).resolves.toEqual(snapshot)
    expect(invokeSnapshotMock).toHaveBeenCalledWith('r1')
  })

  it('отклоняет битый снапшот (неизвестный язык)', async () => {
    invokeSnapshotMock.mockResolvedValue({
      ...snapshot,
      content: { ...snapshot.content, language: 'ruby' },
    } as unknown as CodeContentData)

    await expect(fetchCodeContentSnapshot('r1')).rejects.toThrow()
  })
})
