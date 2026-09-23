import type {
  AppTheme,
  BackgroundKey,
  BorderKey,
  ForegroundKey,
  IntentName,
  SolidKey,
  StateName,
  StepsConfig,
} from '../theme'
import { getColor } from './getColor'
import { withState } from './withState'

/**
 * Цвет кольца клавиатурного фокуса.
 *
 * Выводится из solid-ступени акцентной шкалы (`accent` + `solid/base`) —
 * того же цвета, что уже виден пользователю как «акцентный», поэтому
 * отдельное значение в теме не нужно.
 *
 * @param theme тема приложения (нужны поля `intent` и `steps`)
 * @returns цвет фокус-кольца в формате `#rrggbb`
 */
export function getFocusRing(theme: Pick<AppTheme, 'intent' | 'steps'>): string {
  return getColor(theme, 'accent', 'solid', 'base')
}

/**
 * Функции работы с цветом, связанные с конкретной темой.
 *
 * Прокидываются в объект темы как `theme.utils.*`, чтобы стилизованные
 * компоненты пользовались цветом без импорта чистых функций:
 * `theme.utils.getBackground($variant, 'surface')`. Бинды замыкаются на
 * нужные поля темы (`mode`, `intent`, `steps`, `state`) и делегируют
 * чистым функциям из `base/utils`.
 */
export interface ThemeUtils {
  /** Берёт цвет напрямую: роль + категория + ключ ступени. */
  getColor<C extends keyof StepsConfig, K extends keyof StepsConfig[C]>(
    intentName: IntentName,
    category: C,
    key: K,
  ): string
  /** Подложка слоя: `getBackground(intent, 'surface')` → ступень `background.surface`. */
  getBackground(intentName: IntentName, layer: BackgroundKey): string
  /** Контур: `getBorder(intent, 'default')` → ступень `border.default`. */
  getBorder(intentName: IntentName, strength: BorderKey): string
  /** Текст: `getText(intent, 'primary')` → ступень `foreground.primary`. */
  getText(intentName: IntentName, level: ForegroundKey): string
  /** Насыщенная заливка: `getSolid(intent, 'base')` → ступень `solid.base`. */
  getSolid(intentName: IntentName, step: SolidKey): string
  /** Цвет кольца фокуса (accent / solid / base). */
  getFocusRing(): string
  /** Накладывает оверлей интерактивного состояния (hover/active/selected/disabled). */
  withState(baseColor: string, stateName: StateName): string
}

/** Минимальный набор полей темы, из которых собираются бинды цвета. */
export type ThemeUtilsSource = Pick<AppTheme, 'mode' | 'intent' | 'steps' | 'state'>

/**
 * Собирает `ThemeUtils`, связанные с конкретной темой.
 *
 * Вызывается при конструировании темы из цветовой части (mode + intent +
 * steps + state), поэтому бинды не требуют ни одной ссылки на себя —
 * циклической зависимости нет.
 *
 * @param theme цветовая часть темы
 * @returns объект `utils`, готовый к встраиванию в `AppTheme`
 *
 * @example
 * const colorPart = { mode: 'light', intent, steps, state, contrastText, shadows }
 * const light: AppTheme = { ...colorPart, utils: createThemeUtils(colorPart) }
 */
export function createThemeUtils(theme: ThemeUtilsSource): ThemeUtils {
  return {
    getColor: (intentName, category, key) => getColor(theme, intentName, category, key),
    getBackground: (intentName, layer) => getColor(theme, intentName, 'background', layer),
    getBorder: (intentName, strength) => getColor(theme, intentName, 'border', strength),
    getText: (intentName, level) => getColor(theme, intentName, 'foreground', level),
    getSolid: (intentName, step) => getColor(theme, intentName, 'solid', step),
    getFocusRing: () => getFocusRing(theme),
    withState: (baseColor, stateName) => withState(baseColor, theme, stateName),
  }
}
