import type { AppTheme, IntentName, StepsConfig } from '../theme'

type ColorCategory = keyof StepsConfig

/**
 * Универсальный доступ к цвету: берёт нужную ступень нужной шкалы.
 *
 * Комбинация «роль элемента + категория + ключ» разворачивается в
 * конкретный цвет: `intent` задаёт смысл элемента, `steps[category][key]` —
 * номер ступени этой шкалы (1‑based, индекс в массиве — `step - 1`).
 *
 * @param theme полная тема приложения (нужны поля `intent` и `steps`)
 * @param intentName смысловая роль элемента: neutral / accent / success / warning / danger / info
 * @param category какая CSS-роль нужна: background / border / solid / foreground
 * @param key ключ роли внутри категории (например, `surface` или `primary`)
 * @returns цвет в формате `#rrggbb`
 *
 * @example
 * getColor(theme, 'neutral', 'foreground', 'primary') // было text.primary
 * getColor(theme, 'accent', 'solid', 'base')          // было background.accent
 * getColor(theme, 'danger', 'background', 'surface')  // было status.danger.background
 */
export function getColor<C extends ColorCategory, K extends keyof StepsConfig[C]>(
  theme: Pick<AppTheme, 'intent' | 'steps'>,
  intentName: IntentName,
  category: C,
  key: K,
): string {
  const step = theme.steps[category][key] as number

  return theme.intent[intentName][step - 1]
}
