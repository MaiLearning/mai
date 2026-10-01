import type { SelectItem } from '@mai/theme'
import type { CodeLanguage } from '../../entity'

/** Режимы воркспейса: прохождение и редактор шага. */
export type ViewMode = 'solve' | 'edit'

/** Состояние шага в степ-полосе. */
export type StepStatus = 'idle' | 'current' | 'passed' | 'failed'

/** Человекочитаемые названия языков (порядок ключей = порядок в селекторе языка). */
export const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  rust: 'Rust',
}

/** Языки для выпадающего списка шапки; порядок — как у `LANGUAGE_LABEL`. */
export const LANGUAGE_ITEMS: SelectItem[] = Object.entries(LANGUAGE_LABEL).map(
  ([value, label]) => ({ value, label }),
)
