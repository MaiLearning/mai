import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendUpdateCodeContent } from '../api/content'
import type { CodeContentData, UpdateCodeContentInput } from '../core/model'
import { updateCodeContent } from './content'

vi.mock('../api/content', () => ({ sendUpdateCodeContent: vi.fn() }))

const invokeUpdateContent = vi.mocked(sendUpdateCodeContent)

const input: UpdateCodeContentInput = {
  resourceId: 'r1',
  content: {
    language: 'python',
    steps: [
      {
        id: 's1',
        title: 'Первый шаг',
        instructions: '',
        starterCode: '',
        expectedOutput: 'hello',
      },
    ],
    code: {},
    results: {},
  },
}

const snapshot: CodeContentData = {
  resourceId: 'r1',
  content: input.content,
  createdAt: 1,
  updatedAt: 2,
}

describe('code content service', () => {
  beforeEach(() => invokeUpdateContent.mockReset())

  it('валидирует вход, уходит в API и парсит снапшот-ответ', async () => {
    invokeUpdateContent.mockResolvedValue(snapshot)

    await expect(updateCodeContent(input)).resolves.toEqual(snapshot)
    expect(invokeUpdateContent).toHaveBeenCalledWith(input.resourceId, input.content)
  })

  it('пропускает контент backend-дефолта (пустой объект разворачивается дефолтами)', async () => {
    invokeUpdateContent.mockResolvedValue({
      resourceId: 'r1',
      content: { language: 'python', steps: [], code: {}, results: {} },
      createdAt: 1,
      updatedAt: 2,
    })

    await expect(
      updateCodeContent({ resourceId: 'r1', content: {} as UpdateCodeContentInput['content'] }),
    ).resolves.toMatchObject({ resourceId: 'r1' })
    expect(invokeUpdateContent).toHaveBeenCalledWith('r1', {
      language: 'python',
      steps: [],
      code: {},
      results: {},
    })
  })

  it('отклоняет битый ответ backend без возврата данных', async () => {
    invokeUpdateContent.mockResolvedValue({ resourceId: 42 } as unknown as CodeContentData)

    await expect(updateCodeContent(input)).rejects.toThrow()
  })
})
