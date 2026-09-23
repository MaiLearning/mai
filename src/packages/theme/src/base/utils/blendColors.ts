import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'

/**
 * Смешивает два шестнадцатеричных цвета через alpha-compositing.
 *
 * Формула: `результат = overlay * alpha + base * (1 - alpha)`. Используется
 * как базовая операция оверлея интерактивных состояний (`withState`):
 * поверх уже собранного цвета накладывается полупрозрачный overlay.
 *
 * @param base базовый цвет, поверх которого накладывается оверлей (`#rrggbb`)
 * @param overlay цвет оверлея (`#rrggbb`)
 * @param alpha непрозрачность оверлея от 0 (невидим) до 1 (полностью перекрывает)
 * @returns смешанный цвет в формате `#rrggbb`
 *
 * @example
 * blendColors('#e0e9ff', '#000000', 0.08) // '#ced6ea' — чуть темнее исходного
 */
export function blendColors(base: string, overlay: string, alpha: number): string {
  const baseRgb = hexToRgb(base)
  const overlayRgb = hexToRgb(overlay)

  const r = overlayRgb.r * alpha + baseRgb.r * (1 - alpha)
  const g = overlayRgb.g * alpha + baseRgb.g * (1 - alpha)
  const b = overlayRgb.b * alpha + baseRgb.b * (1 - alpha)

  return rgbToHex(r, g, b)
}
