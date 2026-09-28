import type { AppTheme, SpacingKey } from '../theme'

/**
 * Значение отступа в пропсах раскладки.
 *
 * Ключ каталога `theme.spacing` — для повторяющихся значений, которые
 * удобно называть; число — число **базовых шагов** (`theme.spacing.step`),
 * а не пикселей: `space(6)` — это шесть шагов, то есть 6 × 0.125rem.
 */
export type SpacingValue = SpacingKey | number

/**
 * Приводит значение отступа к CSS-длине: число умножается на базовый шаг
 * темы, ключ каталога берётся из шкалы как есть.
 *
 * @param theme часть темы с отступами (`theme.spacing`)
 * @param value ключ каталога или число базовых шагов
 * @returns значение для CSS-свойства отступа
 */
export function resolveSpace(theme: Pick<AppTheme, 'spacing'>, value: SpacingValue): string {
  if (typeof value === 'number') {
    const { value: step, unit } = theme.spacing.step
    return `${value * step}${unit}`
  }
  return theme.spacing[value]
}
