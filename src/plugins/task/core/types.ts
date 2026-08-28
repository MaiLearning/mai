export type TaskKind =
  | 'SingleChoice'
  | 'MultipleChoice'
  | 'TrueFalse'
  | 'Matching'
  | 'Ordering'
  | 'FillInBlank'
  | 'OpenAnswer'

export type Difficulty = 'easy' | 'medium' | 'hard'

/** Режим отображения любого варианта задачи. */
export type ViewMode = 'solve' | 'edit'

/** Результат проверки, управляет визуальным состоянием тела задачи. */
export type CheckStatus = 'idle' | 'correct' | 'incorrect'

interface BaseTask {
  id: string
  kind: TaskKind
  /** Текст условия / вопроса. */
  prompt: string
  difficulty: Difficulty
}

export interface Choice {
  id: string
  text: string
  correct: boolean
}

export interface SingleChoiceTask extends BaseTask {
  kind: 'SingleChoice'
  choices: Choice[]
}

export interface MultipleChoiceTask extends BaseTask {
  kind: 'MultipleChoice'
  choices: Choice[]
}

export interface TrueFalseTask extends BaseTask {
  kind: 'TrueFalse'
  answer: boolean
}

export interface MatchPair {
  id: string
  left: string
  right: string
}

export interface MatchingTask extends BaseTask {
  kind: 'Matching'
  pairs: MatchPair[]
}

export interface OrderingItem {
  id: string
  text: string
}

export interface OrderingTask extends BaseTask {
  kind: 'Ordering'
  /** Элементы в правильном порядке. */
  items: OrderingItem[]
}

export interface BlankSegment {
  id: string
  /** Текст до пропуска. Пропуск отсутствует, если blank === null. */
  text: string
  blank: string | null
}

export interface FillInBlankTask extends BaseTask {
  kind: 'FillInBlank'
  segments: BlankSegment[]
}

export interface OpenAnswerTask extends BaseTask {
  kind: 'OpenAnswer'
  sampleAnswer: string
  placeholder: string
}

export type AnyTask =
  | SingleChoiceTask
  | MultipleChoiceTask
  | TrueFalseTask
  | MatchingTask
  | OrderingTask
  | FillInBlankTask
  | OpenAnswerTask

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
