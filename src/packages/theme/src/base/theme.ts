import type { ThemeUtils } from './utils/createThemeUtils'

/**
 * Шкала оттенков Radix из 12 позиций [0..11].
 * Позиции соответствуют ролям Radix: 1–2 — фон приложения/страницы,
 * 3–5 — фоны компонентов (rest / hover / active), 6–8 — границы,
 * 9–10 — насыщенная заливка (solid), 11–12 — контрастный текст.
 */
export type ColorScale = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

/**
 * Смысловая роль элемента интерфейса. Каждая роль хранит полную
 * 12-ступенчатую шкалу и отвечает на вопрос «что означает этот элемент»,
 * а не «как он выглядит физически».
 */
export type IntentName = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

/** Ступени шкалы для фонов: на каком визуальном слое находится элемент. */
export type BackgroundKey = 'body' | 'surface' | 'raised' | 'sunken' | 'elevated'

/** Ступени шкалы для границ: насколько контур заметен. */
export type BorderKey = 'subtle' | 'default' | 'strong'

/** Ступени шкалы для насыщенной заливки: solid-кнопка, бейдж. */
export type SolidKey = 'base' | 'hover'

/** Ступени шкалы для текста: приглушённый или основной. */
export type ForegroundKey = 'muted' | 'primary'

/**
 * Индексы ступеней шкалы по категориям. Каждый индекс указывает, какой
 * номер ступени `intent`-шкалы отвечает за конкретную роль. Значения —
 * не цвета, а позиции: комбинация `intent + steps` даёт цвет через
 * `getColor(theme, intentName, category, key)`.
 */
export interface StepsConfig {
  /** Фоны. Комбинация с любой `intent`-шкалой даёт подложку слоя. */
  background: Record<BackgroundKey, number>
  /** Границы. */
  border: Record<BorderKey, number>
  /** Насыщенная заливка. */
  solid: Record<SolidKey, number>
  /** Текст: ступени могут различаться по смысловой роли текста. */
  foreground: Record<IntentName, Record<ForegroundKey, number>>
}

/** Допустимый ключ ступени для категории `steps`. */
export type StepKey<C extends keyof StepsConfig> = C extends 'foreground'
  ? ForegroundKey
  : keyof StepsConfig[C]

/** Текущее состояние интерактивного элемента (категория `state`). */
export type StateName = 'hoverAlpha' | 'activeAlpha' | 'selectedAlpha' | 'disabledAlpha'

/**
 * Единица длины, в которой живёт базовый шаг отступов.
 *
 * Проценты исключены осознанно: шаг — это «сколько раз базовый шаг»,
 * а для процентов умножение не имеет смысла. Токены с процентами —
 * отдельная величина (`layout`).
 */
export type SpacingUnit = 'rem' | 'px' | 'em'

/**
 * Базовый шаг отступов — источник истины всей шкалы.
 *
 * `value` задан в долях `unit`: 0.125 — это 1/8 rem, то есть шаг 2px при
 * корне 16px. Выбрано как точная степенная дробь, поэтому умножение на
 * целое не даёт артефактов float. Переключение системы на пиксели — смена
 * одной пары: `{ value: 2, unit: 'px' }`.
 */
export interface SpacingStep {
  value: number
  unit: SpacingUnit
}

/**
 * Шкала отступов: базовый шаг плюс каталог имён.
 *
 * Каталог — не источник истины, а подсказка для мест, где значение
 * повторяется. Всё, что в каталог не помещается, задаётся числом шагов
 * (`theme.utils.space(6)`), поэтому шкала не растёт вместе с числом
 * различных значений в интерфейсе.
 */
export interface SpacingTokens {
  /** Базовый шаг. */
  step: SpacingStep
  /** Каталог имён: значения — целые кратные `step`. */
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

/** Ключ каталога отступов (`theme.spacing.*`). */
export type SpacingKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Типовой контракт темы приложения.
 *
 * Цвета строятся из трёх осей:
 * - `intent` — смысловая роль элемента (полная 12-ступенчатая шкала);
 * - `steps` — номер ступени шкалы под конкретную CSS-роль (фон/граница/
 *   заливка/текст); ступени foreground могут различаться по интенту и режиму;
 * - `state` — альфа-прозрачность оверлея интерактивного состояния,
 *   применяемая поверх уже собранного цвета через `withState`.
 *
 * `contrastText` — единственная ось, которую нельзя вывести из шкалы:
 * цвет текста поверх насыщенной заливки (например, тёмный текст на
 * жёлтом warning-solid).
 */
export interface AppTheme {
  /** Светлая или тёмная вариация. Определяет направление оверлея state. */
  mode: 'light' | 'dark'
  /** Роли интерфейса: смысловые наборы 12-ступенчатых шкал. */
  intent: Record<IntentName, ColorScale>
  /** Индексы ступеней шкалы для фонов, границ, заливки и текста. */
  steps: StepsConfig
  /** Альфа-прозрачность оверлеев интерактивных состояний. */
  state: {
    hoverAlpha: number
    activeAlpha: number
    selectedAlpha: number
    disabledAlpha: number
  }
  /** Цвет текста на насыщенной заливке соответствующей роли. */
  contrastText: Record<IntentName, string>
  /**
   * Связанные с темой функции цвета. Доступны прямо в стилизованных
   * компонентах через `theme.utils.*` — импорты чистых функций не нужны.
   */
  utils: ThemeUtils
  /** Типографика, отступы, скругления, тени, наслоение и длительности. */
  typography: {
    fontFamily: string
    fontFamilyMonospace: string
    sizes: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    weights: {
      regular: number
      medium: number
      semibold: number
      bold: number
    }
    lineHeights: {
      tight: number
      normal: number
      relaxed: number
    }
  }
  spacing: SpacingTokens
  radius: {
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
  zIndex: {
    popover: number
    toast: number
    modal: number
  }
  durations: {
    fast: string
    normal: string
    slow: string
  }
  /**
   * Токены раскладки: размеры центрируемой области, в отличие от
   * `spacing` (микро-отступы) — это не про расстояния между элементами,
   * а про габариты области. Отсюда `Container` берёт `size`.
   */
  layout: {
    /** Потолки ширины центрируемых областей. */
    containerWidths: {
      /** Узкая область: панели, боковые блоки, диалоги. */
      narrow: string
      /** Текстовая колонка для чтения: обзоры, описания. */
      read: string
      /** Область листинга кода. */
      code: string
      /** Широкая область: каркас страницы, каталоги. */
      wide: string
    }
  }
}
