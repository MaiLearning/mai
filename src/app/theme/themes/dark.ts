import type { AppTheme } from '../theme'
import { lightTheme } from './light'

/** Темная тема использует тот же полный контракт semantic tokens. */
export const darkTheme: AppTheme = {
  ...lightTheme,
  name: 'dark',
  colors: {
    ...lightTheme.colors,
    body: '#111118',
    surface: '#191922',
    surfaceElevated: '#232330',
    border: '#373744',
    borderStrong: '#505060',
    text: '#f2f2f8',
    textMuted: '#aaaabd',
    textOnPrimary: '#ffffff',
    primary: '#8b8af5',
    primaryHover: '#a9a5ff',
    primarySurface: '#302e68',
    danger: '#ef767a',
    dangerHover: '#ff9295',
    dangerSurface: '#512629',
    warning: '#f5b942',
    warningSurface: '#4d3c1c',
    success: '#46c98b',
    successSurface: '#1c4735',
    info: '#60a5fa',
    infoSurface: '#1e3a5f',
    focus: '#a9a5ff',
    overlay: 'rgb(0 0 0 / 60%)',
  },
}
