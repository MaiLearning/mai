import type { AnyTask, TaskContent, TaskResult } from '../core/types'

/** Проверка: результат по задаче + факт прохождения (неважно, верно или нет). */
export function withResult(content: TaskContent, taskId: string, result: TaskResult): TaskContent {
  return {
    ...content,
    results: { ...content.results, [taskId]: result },
    completed: { ...content.completed, [taskId]: true },
  }
}

/**
 * «Пройти заново»: ответ и результат стираются — задача снова в состоянии
 * «не решалась»; факт прохождения остаётся.
 */
export function withRestart(content: TaskContent, taskId: string): TaskContent {
  const answers = { ...content.answers }
  const results = { ...content.results }
  delete answers[taskId]
  delete results[taskId]

  return { ...content, answers, results }
}

/**
 * Правка содержания задачи: ответ, результат и факт прохождения сбрасываются —
 * задача изменилась и считается непройденной до новой проверки.
 */
export function withTaskEdited(content: TaskContent, taskId: string, next: AnyTask): TaskContent {
  const answers = { ...content.answers }
  const results = { ...content.results }
  const completed = { ...content.completed }
  delete answers[taskId]
  delete results[taskId]
  delete completed[taskId]

  return {
    ...content,
    tasks: content.tasks.map((task) => (task.id === taskId ? next : task)),
    answers,
    results,
    completed,
  }
}

/** Удаление задачи: убирается вместе со своим ответом, результатом и флагом прохождения. */
export function withTaskDeleted(content: TaskContent, taskId: string): TaskContent {
  const answers = { ...content.answers }
  const results = { ...content.results }
  const completed = { ...content.completed }
  delete answers[taskId]
  delete results[taskId]
  delete completed[taskId]

  return {
    ...content,
    tasks: content.tasks.filter((task) => task.id !== taskId),
    answers,
    results,
    completed,
  }
}
