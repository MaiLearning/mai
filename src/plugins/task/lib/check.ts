import type {
  AnyTask,
  FillInBlankAnswer,
  MatchingAnswer,
  MultipleChoiceAnswer,
  OrderingAnswer,
  SingleChoiceAnswer,
  TaskAnswer,
  TaskResult,
  TrueFalseAnswer,
} from '../core/types'

const normalize = (value: string) => value.trim().toLowerCase()

/**
 * Проверка ответа прохождения против задачи. Ответ другого типа или
 * отсутствующий трактуется как неверный; свободный ответ не проверяется
 * автоматически — всегда «верно» (раскрывает эталон).
 */
export function checkTask(task: AnyTask, answer: TaskAnswer | undefined): TaskResult {
  if (!answer || answer.kind !== task.kind) return 'incorrect'

  switch (task.kind) {
    case 'SingleChoice': {
      const a = answer as SingleChoiceAnswer

      return a.choiceId !== null && isCorrectChoice(task.choices, a.choiceId)
        ? 'correct'
        : 'incorrect'
    }
    case 'MultipleChoice': {
      const a = answer as MultipleChoiceAnswer

      return sameSet(
        a.choiceIds,
        task.choices.filter((c) => c.correct).map((c) => c.id),
      )
        ? 'correct'
        : 'incorrect'
    }
    case 'TrueFalse': {
      const a = answer as TrueFalseAnswer

      return a.value !== null && a.value === task.answer ? 'correct' : 'incorrect'
    }
    case 'Matching': {
      const a = answer as MatchingAnswer

      return task.pairs.every((pair) => a.mapping[pair.id] === pair.id) ? 'correct' : 'incorrect'
    }
    case 'Ordering': {
      const a = answer as OrderingAnswer

      return a.itemIds.length === task.items.length &&
        task.items.every((item, i) => a.itemIds[i] === item.id)
        ? 'correct'
        : 'incorrect'
    }
    case 'FillInBlank': {
      const a = answer as FillInBlankAnswer

      return task.segments
        .filter((seg): seg is typeof seg & { blank: string } => seg.blank !== null)
        .every((seg) => normalize(a.values[seg.id] ?? '') === normalize(seg.blank))
        ? 'correct'
        : 'incorrect'
    }
    case 'OpenAnswer':
      return 'correct'
  }
}

const isCorrectChoice = (choices: { id: string; correct: boolean }[], choiceId: string) =>
  choices.some((c) => c.id === choiceId && c.correct)

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && new Set(a).size === a.length && b.every((id) => a.includes(id))
