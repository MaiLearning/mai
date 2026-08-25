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

// --- HSV ---

/** Цвет в координатах HSV: hue 0–360, saturation/value 0–1. */
export interface Hsv {
  h: number
  s: number
  v: number
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/** Конвертация HSV → RGB (каналы 0–255). */
export function hsvToRgb({ h, s, v }: Hsv): [number, number, number] {
  const chroma = v * s
  const hp = (((h % 360) + 360) % 360) / 60
  const x = chroma * (1 - Math.abs((hp % 2) - 1))

  let r = 0
  let g = 0
  let b = 0

  if (hp < 1) {
    ;[r, g, b] = [chroma, x, 0]
  } else if (hp < 2) {
    ;[r, g, b] = [x, chroma, 0]
  } else if (hp < 3) {
    ;[r, g, b] = [0, chroma, x]
  } else if (hp < 4) {
    ;[r, g, b] = [0, x, chroma]
  } else if (hp < 5) {
    ;[r, g, b] = [x, 0, chroma]
  } else {
    ;[r, g, b] = [chroma, 0, x]
  }

  const m = v - chroma

  return [
    Math.round(clamp01(r + m) * 255),
    Math.round(clamp01(g + m) * 255),
    Math.round(clamp01(b + m) * 255),
  ]
}

/** Конвертация RGB (каналы 0–255) → HSV. */
export function rgbToHsv(r: number, g: number, b: number): Hsv {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6)
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
  }
  if (h < 0) h += 360

  return { h, s: max === 0 ? 0 : delta / max, v: max }
}

/** Конвертация HSV → hex-строка вида `#rrggbb`. */
export function hsvToHex(hsv: Hsv): string {
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, '0')

  const [r, g, b] = hsvToRgb(hsv)

  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/** Конвертация hex-строки в HSV. Некорректные каналы трактуются как 0. */
export function hexToHsv(hex: string): Hsv {
  const [r, g, b] = toRgb(hex)

  return rgbToHsv(r, g, b)
}
