import type { AppTheme, IntentName, StepsConfig } from '../../theme'

/**
 * Индексы общих для режимов ролей. Foreground задаётся отдельно для каждой
 * цветовой вариации: контрастные ступени хроматических шкал в dark светлее,
 * чем нужно для текста на поверхности, поэтому там используется ступень 11.
 *
 * Ступени Radix семантичны и не зависят от цветового режима: 1–2 — фоны
 * страницы, 3–5 — подложки компонентов, 6–8 — границы, 9–10 — solid.
 */
const commonSteps: Omit<StepsConfig, 'foreground'> = {
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
}

const lightForeground: StepsConfig['foreground'] = {
  neutral: { muted: 11, primary: 12 },
  accent: { muted: 11, primary: 12 },
  success: { muted: 11, primary: 12 },
  warning: { muted: 11, primary: 12 },
  danger: { muted: 11, primary: 12 },
  info: { muted: 11, primary: 12 },
}

const darkForeground: StepsConfig['foreground'] = {
  neutral: { muted: 11, primary: 12 },
  accent: { muted: 11, primary: 11 },
  success: { muted: 11, primary: 11 },
  warning: { muted: 11, primary: 11 },
  danger: { muted: 11, primary: 11 },
  info: { muted: 11, primary: 11 },
}

/** Ступени стандартной светлой темы. */
export const lightSteps: StepsConfig = {
  ...commonSteps,
  foreground: lightForeground,
}

/** Ступени стандартной тёмной темы. */
export const darkSteps: StepsConfig = {
  ...commonSteps,
  foreground: darkForeground,
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
