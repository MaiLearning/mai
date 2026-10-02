import type { AppTheme } from '../../theme'

/**
 * Токены, общие для всех тем: типографика, отступы, скругления, наслоение
 * и длительности. Конкретная тема спредит базовые значения и добавляет
 * только то, что действительно меняется между темами (семантические цвета,
 * shadows).
 */
export const base: Omit<
  AppTheme,
  'mode' | 'intent' | 'steps' | 'state' | 'contrastText' | 'utils' | 'shadows'
> = {
  typography: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMonospace:
      "ui-monospace, 'Cascadia Code', 'Fira Code', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  spacing: {
    // Базовый шаг: 0.125rem = 2px при корне 16px. Каталог ниже — целые
    // кратные шага (2/4/8/12/16), отсюда и значения.
    step: { value: 0.125, unit: 'rem' },
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.625rem',
    full: '9999px',
  },
  // Наслоение снизу вверх. Попап порталится в body и обязан пережить
  // модалку, иначе раскрытый Select/DropdownMenu уедет под её подложку.
  zIndex: {
    modal: 1200,
    popover: 1300,
    toast: 1400,
  },
  durations: {
    fast: '120ms',
    normal: '200ms',
    slow: '300ms',
  },
  layout: {
    containerWidths: {
      narrow: '25rem',
      read: '47.5rem',
      code: '53.75rem',
      wide: '75rem',
    },
  },
}
