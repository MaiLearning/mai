import type { AppTheme, IntentName, StepsConfig } from '../../theme'

/**
 * Индексы ступеней шкалы, общие для светлой и тёмной вариаций дизайна.
 *
 * Ступени Radix семантичны и не зависят от цветового режима: 1–2 — фоны
 * страницы, 3–5 — подложки компонентов, 6–8 — границы, 9–10 — solid,
 * 11–12 — текст. Поэтому один конфиг подходит обеим вариациям, а набор
 * цветов для каждой темы получается комбинацией `steps` с её шкалами.
 */
export const steps: StepsConfig = {
  background: {
    body: 1,
    surface: 2,
    raised: 3,
    sunken: 1,
    elevated: 4,
  },
  border: {
    subtle: 6,
    default: 7,
    strong: 8,
  },
  solid: {
    base: 9,
    hover: 10,
  },
  foreground: {
    muted: 11,
    primary: 12,
  },
}

/**
 * Альфа-прозрачность оверлея интерактивных состояний. Применяется поверх
 * любого собранного цвета через `withState`. Начальные значения — тюнинг.
 */
export const state: AppTheme['state'] = {
  hoverAlpha: 0.06,
  activeAlpha: 0.12,
  selectedAlpha: 0.08,
  disabledAlpha: 0.32,
}

/**
 * Цвет текста на насыщенной заливке. Не выводится из шкалы: на тёмных и
 * сильно насыщенных ступенях нужен контрастный цвет, а у жёлтых/оранжевых
 * шкал тёмный текст работает лучше белого.
 */
export const contrastText: Record<IntentName, string> = {
  neutral: '#ffffff',
  accent: '#ffffff',
  success: '#ffffff',
  warning: '#1a1a1a',
  danger: '#ffffff',
  info: '#ffffff',
}
