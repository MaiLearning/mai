import type { AppTheme } from '../theme'
import { typography } from '../typography'

const shared = {
  font: {
    display: typography.fontFamilyDisplay,
    body: typography.fontFamilyBody,
  },
  typography: {
    fontFamily: typography.fontFamilyBody,
    fontFamilyMonospace: typography.fontFamilyMonospace,
    headings: typography.headings.sizes,
  },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  radii: { sm: '8px', md: '12px', lg: '18px', xl: '26px', pill: '999px' },
  shadows: {
    sm: '0 1px 2px rgba(23,21,40,0.06)',
    md: '0 6px 20px rgba(23,21,40,0.08)',
    lg: '0 20px 50px rgba(23,21,40,0.12)',
  },
  transitions: { fast: '120ms ease', normal: '180ms ease' },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
} as const

export const lightTheme: AppTheme = {
  name: 'light',
  colors: {
    body: '#f6f6fb',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    btn: '#f1f4f7',
    btnHover: '#e8edf2',
    border: '#e7e6f0',
    borderStrong: '#d0cfe0',
    text: '#171528',
    textMuted: '#6b6880',
    textOnPrimary: '#ffffff',
    primary: '#5b46f5',
    primaryHover: '#4a37d4',
    primarySurface: '#ecebff',
    accent: '#f5a524',
    accentSurface: '#fdf1dc',
    danger: '#c24145',
    dangerHover: '#a83236',
    dangerSurface: '#fde8e8',
    warning: '#b45309',
    warningSurface: '#fff4d6',
    success: '#1eae6f',
    successSurface: '#e3f7ee',
    info: '#2563eb',
    infoSurface: '#dbeafe',
    focus: '#5b46f5',
    overlay: 'rgb(0 0 0 / 35%)',
  },
  ...shared,
}
