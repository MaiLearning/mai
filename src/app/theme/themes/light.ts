import type { AppTheme } from '../theme'

const typography = {
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  headings: {
    h1: { fontSize: '2rem', fontWeight: '700', lineHeight: '1.3' },
    h2: { fontSize: '1.75rem', fontWeight: '700', lineHeight: '1.35' },
    h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
    h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4' },
    h5: { fontSize: '1rem', fontWeight: '500', lineHeight: '1.5' },
    h6: { fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.5' },
  },
} as const

const shared = {
  typography,
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  radii: { sm: '4px', md: '8px', lg: '12px', pill: '999px' },
  shadows: {
    sm: '0 1px 3px rgb(0 0 0 / 12%)',
    md: '0 4px 12px rgb(0 0 0 / 18%)',
    lg: '0 12px 32px rgb(0 0 0 / 24%)',
  },
  transitions: { fast: '120ms ease', normal: '180ms ease' },
} as const

export const lightTheme: AppTheme = {
  name: 'light',
  colors: {
    body: '#ffffff',
    surface: '#f8f8fc',
    surfaceElevated: '#ffffff',
    border: '#dedee8',
    borderStrong: '#c7c7d4',
    text: '#242333',
    textMuted: '#77778a',
    textOnPrimary: '#ffffff',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primarySurface: '#ececff',
    danger: '#c24145',
    dangerHover: '#a83236',
    dangerSurface: '#fde8e8',
    warning: '#b45309',
    warningSurface: '#fff4d6',
    success: '#047857',
    successSurface: '#dcfce7',
    info: '#2563eb',
    infoSurface: '#dbeafe',
    focus: '#6366f1',
    overlay: 'rgb(0 0 0 / 35%)',
  },
  ...shared,
}
