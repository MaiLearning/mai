import type { CustomDifficulty } from '../core/types'

/** Тон пресетной сложности: красится цветами темы. */
export type DifficultyTone = 'easy' | 'medium' | 'hard'

export interface DifficultyPreset {
  id: DifficultyTone
  label: string
}

/** Пресетные сложности — фиксированы, не редактируются и не удаляются. */
export const DIFFICULTY_PRESETS: readonly DifficultyPreset[] = [
  { id: 'easy', label: 'Лёгкая' },
  { id: 'medium', label: 'Средняя' },
  { id: 'hard', label: 'Сложная' },
]

/** Итоговый вид сложности: пресет (тон темы) либо своя (цвет автора). */
export type DifficultyView =
  | { id: string; label: string; tone: DifficultyTone }
  | { id: string; label: string; color: string }

/**
 * Разрешает id сложности в отображаемый вид. Пресетные id резолвятся
 * в тон, остальные ищутся среди своих сложностей набора.
 */
export function resolveDifficulty(
  id: string,
  custom: readonly CustomDifficulty[],
): DifficultyView | null {
  const preset = DIFFICULTY_PRESETS.find((d) => d.id === id)
  if (preset) return { id: preset.id, label: preset.label, tone: preset.id }

  const found = custom.find((d) => d.id === id)

  return found ? { id: found.id, label: found.label, color: found.color } : null
}

/** Тон бейджа для пресета; для своей сложности — undefined. */
export function difficultyTone(view: DifficultyView | null): DifficultyTone | undefined {
  return view && 'tone' in view ? view.tone : undefined
}

/** Цвет бейджа для своей сложности; для пресета — undefined. */
export function difficultyColor(view: DifficultyView | null): string | undefined {
  return view && 'color' in view ? view.color : undefined
}
