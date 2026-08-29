import type { AnyTask, Difficulty, TaskKind } from '@/entities/task-plugin'

export type {
  AnyTask,
  BlankSegment,
  Choice,
  Difficulty,
  FillInBlankTask,
  MatchingTask,
  MatchPair,
  MultipleChoiceTask,
  OpenAnswerTask,
  OrderingItem,
  OrderingTask,
  SingleChoiceTask,
  TaskContent,
  TaskContentData,
  TaskKind,
  TrueFalseTask,
} from '@/entities/task-plugin'

/** Режим отображения любого варианта задачи. */
export type ViewMode = 'solve' | 'edit'

/** Результат проверки, управляет визуальным состоянием тела задачи. */
export type CheckStatus = 'idle' | 'correct' | 'incorrect'

/** Пропсы, которые получает каждый компонент варианта задачи из реестра. */
export interface TaskComponentProps<T extends AnyTask = AnyTask> {
  task: T
  mode: ViewMode
  status: CheckStatus
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

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
}
