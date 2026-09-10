import type { CodeLanguage } from '@/entities/code-plugin'

/** Режимы воркспейса: прохождение и редактор шага. */
export type ViewMode = 'solve' | 'edit'

/** Состояние шага в степ-полосе. */
export type StepStatus = 'idle' | 'current' | 'passed' | 'failed'

/** Человекочитаемые названия языков. */
export const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  python: 'Python',
  javascript: 'JavaScript',
}
