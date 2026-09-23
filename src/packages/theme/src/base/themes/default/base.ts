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
  zIndex: {
    popover: 1000,
    toast: 1100,
    modal: 1200,
  },
  durations: {
    fast: '120ms',
    normal: '200ms',
    slow: '300ms',
  },
}
