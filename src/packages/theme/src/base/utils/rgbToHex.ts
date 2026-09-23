/**
 * Склеивает компоненты RGB обратно в шестнадцатеричный цвет.
 *
 * Каналы задаются числами с плавающей точкой (`blendColors` может вернуть
 * нецелые значения) — округление и дополнение нулями происходит здесь,
 * поэтому результат всегда корректный 6‑значный hex.
 *
 * @param r красный канал (0–255)
 * @param g зелёный канал (0–255)
 * @param b синий канал (0–255)
 * @returns цвет в формате `#rrggbb`
 *
 * @example
 * rgbToHex(206.08, 214.36, 234.6) // '#ced6ea'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' + [r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')
  )
}
