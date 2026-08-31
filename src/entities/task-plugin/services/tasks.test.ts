import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sendCreateTask,
  sendDeleteTask,
  sendUpdateTaskContent,
  sendUpdateTaskDifficulty,
} from '../api/tasks'
import type { AnyTask } from '../core/model'
import { createTask, deleteTask, updateTaskContent, updateTaskDifficulty } from './tasks'

vi.mock('../api/tasks', () => ({
  sendCreateTask: vi.fn(),
  sendUpdateTaskContent: vi.fn(),
  sendUpdateTaskDifficulty: vi.fn(),
  sendDeleteTask: vi.fn(),
}))

const invokeCreate = vi.mocked(sendCreateTask)
const invokeUpdateContent = vi.mocked(sendUpdateTaskContent)
const invokeUpdateDifficulty = vi.mocked(sendUpdateTaskDifficulty)
const invokeDelete = vi.mocked(sendDeleteTask)

const task: AnyTask = { id: 't1', prompt: '', difficulty: 'easy', kind: 'TrueFalse', answer: true }

describe('task create service', () => {
  beforeEach(() => invokeCreate.mockReset())

  it('валидирует вход и задачу backend', async () => {
    invokeCreate.mockResolvedValue(task)

    await expect(createTask({ resourceId: 'r1', kind: 'TrueFalse' })).resolves.toEqual(task)
    expect(invokeCreate).toHaveBeenCalledWith('r1', 'TrueFalse')
  })

  it('отклоняет неизвестный тип задачи без вызова API', async () => {
    await expect(createTask({ resourceId: 'r1', kind: 'Puzzle' as 'TrueFalse' })).rejects.toThrow()
    expect(invokeCreate).not.toHaveBeenCalled()
  })
})

describe('task content service', () => {
  beforeEach(() => {
    invokeUpdateContent.mockReset()
    invokeUpdateDifficulty.mockReset()
    invokeDelete.mockReset()
  })

  it('updateTaskContent валидирует вход и уходит в API', async () => {
    await updateTaskContent({ taskId: 't1', task })

    expect(invokeUpdateContent).toHaveBeenCalledWith('t1', task)
  })

  it('updateTaskDifficulty валидирует вход и уходит в API', async () => {
    await updateTaskDifficulty({ taskId: 't1', difficulty: 'medium' })

    expect(invokeUpdateDifficulty).toHaveBeenCalledWith('t1', 'medium')
  })

  it('deleteTask валидирует вход и уходит в API', async () => {
    await deleteTask({ taskId: 't1' })

    expect(invokeDelete).toHaveBeenCalledWith('t1')
  })

  it('отклоняет битую задачу без вызова API', async () => {
    await expect(
      updateTaskContent({ taskId: 't1', task: { kind: 'TrueFalse' } as AnyTask }),
    ).rejects.toThrow()
    expect(invokeUpdateContent).not.toHaveBeenCalled()
  })
})
