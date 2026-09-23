import type { AppTheme, StateName } from '../theme'
import { blendColors } from './blendColors'

/**
 * Накладывает полупрозрачный оверлей интерактивного состояния поверх
 * уже собранного цвета.
 *
 * Цвет оверлея определяется режимом темы: в светлой — чёрный (элемент
 * затемняется), в тёмной — белый (элемент осветляется). Значения альф
 * берутся из `theme.state`.
 *
 * @param baseColor базовый цвет, собранный из intent + steps (`#rrggbb`)
 * @param theme тема приложения (нужны поля `mode` и `state`)
 * @param stateName какое состояние применяется: hoverAlpha / activeAlpha / selectedAlpha / disabledAlpha
 * @returns смешанный цвет в формате `#rrggbb`
 *
 * @example
 * withState(getColor(theme, 'neutral', 'background', 'surface'), theme, 'hoverAlpha')
 */
export function withState(
  baseColor: string,
  theme: Pick<AppTheme, 'mode' | 'state'>,
  stateName: StateName,
): string {
  const alpha = theme.state[stateName]
  const overlayColor = theme.mode === 'light' ? '#000000' : '#ffffff'

  return blendColors(baseColor, overlayColor, alpha)
}
