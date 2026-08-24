/** Утилиты работы с hex-цветами карточки курса. */

export function normalizeHex(value: string): string {
  const raw = value.trim().replace(/^#/, '')
  if (raw.length === 3) {
    return `#${raw
      .split('')
      .map((char) => char + char)
      .join('')}`.toLowerCase()
  }
  return `#${raw.slice(0, 6)}`.toLowerCase()
}

export function isValidHex(value: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

function toRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex).slice(1)
  const int = Number.parseInt(normalized.padEnd(6, '0'), 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

/** Относительная яркость по WCAG. */
export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Смешивание двух цветов, ratio 0 → a, 1 → b. */
export function mix(a: string, b: string, ratio = 0.5): string {
  const [r1, g1, b1] = toRgb(a)
  const [r2, g2, b2] = toRgb(b)
  const channel = (x: number, y: number) =>
    Math.round(x + (y - x) * ratio)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`
}

/** Контрастный цвет текста поверх заданного фона. */
export function readableOn(hex: string): string {
  return luminance(hex) > 0.45 ? '#161428' : '#ffffff'
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = toRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
