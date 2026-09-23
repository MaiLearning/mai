/**
 * Три канала RGB-цвета, выраженные целыми числами в диапазоне 0–255.
 */
export interface Rgb {
  r: number
  g: number
  b: number
}

/**
 * Разбирает шестнадцатеричный цвет в компоненты RGB.
 *
 * Поддерживает только 6‑значную запись `#rrggbb` без сокращённой `#rgb`:
 * все значения `intent`-шкал в теме — полные 6‑значные hex.
 *
 * @param hex цвет в формате `#rrggbb` (префикс `#` необязателен)
 * @returns компоненты цвета `{ r, g, b }` в диапазоне 0–255
 *
 * @example
 * hexToRgb('#e0e9ff') // { r: 224, g: 233, b: 255 }
 */
export function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}
