import type { AnyTask, TaskAnswer, TaskKind } from '@/entities/task-plugin'

export type {
  AnyTask,
  BlankSegment,
  Choice,
  CustomDifficulty,
  Difficulty,
  FillInBlankAnswer,
  FillInBlankTask,
  MatchingAnswer,
  MatchingTask,
  MatchPair,
  MultipleChoiceAnswer,
  MultipleChoiceTask,
  OpenAnswerAnswer,
  OpenAnswerTask,
  OrderingAnswer,
  OrderingItem,
  OrderingTask,
  SingleChoiceAnswer,
  SingleChoiceTask,
  TaskAnswer,
  TaskAttempt,
  TaskContent,
  TaskKind,
  TaskResult,
  TaskSnapshotData,
  TrueFalseAnswer,
  TrueFalseTask,
} from '@/entities/task-plugin'

/** Режим отображения любого варианта задачи. */
export type ViewMode = 'solve' | 'edit'

/** Результат проверки, управляет визуальным состоянием тела задачи. */
export type CheckStatus = 'idle' | 'correct' | 'incorrect'

/** Пропсы, которые получает каждый компонент варианта задачи из реестра. */
export interface TaskComponentProps<
  T extends AnyTask = AnyTask,
  A extends TaskAnswer = TaskAnswer,
> {
  task: T
  mode: ViewMode
  status: CheckStatus
  /** Правка задачи в режиме edit: компонент отдаёт обновлённую задачу целиком. */
  onChange?: (next: T) => void
  /** Сохранённый ответ прохождения; undefined — задача ещё не решалась. */
  answer?: A
  /** Выбор в режиме прохождения: компонент отдаёт ответ своего типа. */
  onAnswer?: (answer: A) => void
}

export const TASK_KIND_LABEL: Record<TaskKind, string> = {
  SingleChoice: 'Один ответ',
  MultipleChoice: 'Несколько ответов',
  TrueFalse: 'Да / Нет',
  Matching: 'Сопоставление',
  Ordering: 'Порядок',
  FillInBlank: 'Пропуски',
  OpenAnswer: 'Свободный ответ',
}
