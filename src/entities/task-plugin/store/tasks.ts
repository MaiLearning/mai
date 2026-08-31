import { atom } from 'jotai'
import type {
  AnyTask,
  CreateTaskInput,
  DeleteTaskInput,
  TaskContent,
  TaskSnapshotData,
  UpdateTaskContentInput,
  UpdateTaskDifficultyInput,
} from '../core/model'
import { createTask, deleteTask, updateTaskContent, updateTaskDifficulty } from '../services/tasks'
import { taskSnapshotsAtom } from './atoms'

/** Создание задачи: вернувшаяся задача (id и дефолты — от backend) дописывается в снапшот. */
export const createTaskAtom = atom(null, async (_get, set, input: CreateTaskInput) => {
  const task = await createTask(input)
  set(taskSnapshotsAtom, (prev) => {
    const snapshot = prev[input.resourceId]
    if (!snapshot) return prev

    return {
      ...prev,
      [input.resourceId]: {
        ...snapshot,
        content: { ...snapshot.content, tasks: [...snapshot.content.tasks, task] },
      },
    }
  })

  return task
})

/** Замена определения задачи: прогресс прохождения сбрасывается (зеркало backend). */
export const updateTaskContentAtom = atom(
  null,
  async (_get, set, input: UpdateTaskContentInput) => {
    await updateTaskContent(input)
    set(taskSnapshotsAtom, (prev) =>
      patchByTask(prev, input.taskId, (content) => replaceTask(content, input.taskId, input.task)),
    )
  },
)

/** Правка только сложности: метаданные, прогресс не трогается. */
export const updateTaskDifficultyAtom = atom(
  null,
  async (_get, set, input: UpdateTaskDifficultyInput) => {
    await updateTaskDifficulty(input)
    set(taskSnapshotsAtom, (prev) =>
      patchByTask(prev, input.taskId, (content) => {
        const task = content.tasks.find((t) => t.id === input.taskId)
        if (!task) return content

        return replaceTask(
          content,
          input.taskId,
          { ...task, difficulty: input.difficulty },
          { keepProgress: true },
        )
      }),
    )
  },
)

/** Удаление задачи: убирается вместе со своим ответом, результатом и флагом прохождения. */
export const deleteTaskAtom = atom(null, async (_get, set, input: DeleteTaskInput) => {
  await deleteTask(input)
  set(taskSnapshotsAtom, (prev) =>
    patchByTask(prev, input.taskId, (content) => {
      const answers = { ...content.answers }
      const results = { ...content.results }
      const completed = { ...content.completed }
      delete answers[input.taskId]
      delete results[input.taskId]
      delete completed[input.taskId]

      return {
        ...content,
        tasks: content.tasks.filter((t) => t.id !== input.taskId),
        answers,
        results,
        completed,
      }
    }),
  )
})

/** Патч снапшота, в котором лежит задача; снапшоты без этой задачи не меняются. */
function patchByTask(
  snapshots: Record<string, TaskSnapshotData>,
  taskId: string,
  patch: (content: TaskContent) => TaskContent,
) {
  const resourceId = Object.keys(snapshots).find((id) =>
    snapshots[id].content.tasks.some((task) => task.id === taskId),
  )
  if (!resourceId) return snapshots
  const snapshot = snapshots[resourceId]

  return { ...snapshots, [resourceId]: { ...snapshot, content: patch(snapshot.content) } }
}

/** Замена задачи в контенте; по умолчанию её прогресс прохождения сбрасывается. */
function replaceTask(
  content: TaskContent,
  taskId: string,
  next: AnyTask,
  { keepProgress = false }: { keepProgress?: boolean } = {},
): TaskContent {
  const answers = { ...content.answers }
  const results = { ...content.results }
  const completed = { ...content.completed }
  if (!keepProgress) {
    delete answers[taskId]
    delete results[taskId]
    delete completed[taskId]
  }

  return {
    ...content,
    tasks: content.tasks.map((task) => (task.id === taskId ? next : task)),
    answers,
    results,
    completed,
  }
}
