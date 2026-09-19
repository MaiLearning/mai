import {
  sendCreateTask as invokeCreate,
  sendDeleteTask as invokeDelete,
  sendUpdateTaskContent as invokeUpdateContent,
  sendUpdateTaskDifficulty as invokeUpdateDifficulty,
} from '../api/tasks'
import type {
  AnyTask,
  CreateTaskInput,
  DeleteTaskInput,
  UpdateTaskContentInput,
  UpdateTaskDifficultyInput,
} from '../core/model'
import {
  CreateTaskInputSchema,
  DeleteTaskInputSchema,
  TaskSchema,
  UpdateTaskContentInputSchema,
  UpdateTaskDifficultyInputSchema,
} from '../core/schema'

export async function createTask(input: CreateTaskInput): Promise<AnyTask> {
  const request = CreateTaskInputSchema.parse(input)
  const task = await invokeCreate(request.resourceId, request.kind)

  return TaskSchema.parse(task)
}

export async function updateTaskContent(input: UpdateTaskContentInput): Promise<void> {
  const request = UpdateTaskContentInputSchema.parse(input)
  await invokeUpdateContent(request.taskId, request.task)
}

export async function updateTaskDifficulty(input: UpdateTaskDifficultyInput): Promise<void> {
  const request = UpdateTaskDifficultyInputSchema.parse(input)
  await invokeUpdateDifficulty(request.taskId, request.difficulty)
}

export async function deleteTask(input: DeleteTaskInput): Promise<void> {
  const request = DeleteTaskInputSchema.parse(input)
  await invokeDelete(request.taskId)
}
