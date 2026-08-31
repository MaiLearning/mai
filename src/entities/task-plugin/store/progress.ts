import { atom } from 'jotai'
import type {
  RestartTaskInput,
  SetTaskResultInput,
  SubmitTaskAnswerInput,
  TaskContent,
  TaskSnapshotData,
} from '../core/model'
import { restartTask, setTaskResult, submitTaskAnswer } from '../services/progress'
import { taskSnapshotsAtom } from './atoms'

/** Сохранение ответа прохождения (без проверки). */
export const submitTaskAnswerAtom = atom(null, async (_get, set, input: SubmitTaskAnswerInput) => {
  await submitTaskAnswer(input)
  set(taskSnapshotsAtom, (prev) =>
    patchContent(prev, input.taskId, (content) => ({
      ...content,
      answers: { ...content.answers, [input.taskId]: input.answer },
    })),
  )
})

/**
 * Проверка: ответ + результат + факт прохождения (зеркало backend —
 * там это одна команда и запись попытки в историю).
 */
export const setTaskResultAtom = atom(null, async (_get, set, input: SetTaskResultInput) => {
  await setTaskResult(input)
  set(taskSnapshotsAtom, (prev) =>
    patchContent(prev, input.taskId, (content) => ({
      ...content,
      answers: input.answer
        ? { ...content.answers, [input.taskId]: input.answer }
        : content.answers,
      results: { ...content.results, [input.taskId]: input.result },
      completed: { ...content.completed, [input.taskId]: true },
    })),
  )
})

/** «Пройти заново»: ответ и результат стираются; факт прохождения остаётся. */
export const restartTaskAtom = atom(null, async (_get, set, input: RestartTaskInput) => {
  await restartTask(input)
  set(taskSnapshotsAtom, (prev) =>
    patchContent(prev, input.taskId, (content) => {
      const answers = { ...content.answers }
      const results = { ...content.results }
      delete answers[input.taskId]
      delete results[input.taskId]

      return { ...content, answers, results }
    }),
  )
})

/** Патч снапшота, в котором лежит задача; снапшоты без этой задачи не меняются. */
function patchContent(
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
