import { darkTheme } from './themes/dark'
import { lightTheme } from './themes/light'

/**
 * Имя встроенной или пользовательской темы.
 * При добавлении новой темы ее идентификатор нужно добавить сюда и в registry.
 * Компоненты не проверяют ThemeName: они используют semantic tokens темы.
 */
export type ThemeName = 'light' | 'dark' | 'sepia' | 'midnight'
export type ThemePreference = ThemeName | 'system'

export interface AppTheme {
  name: ThemeName
  colors: {
    body: string
    surface: string
    surfaceElevated: string
    border: string
    borderStrong: string
    text: string
    textMuted: string
    textOnPrimary: string
    primary: string
    primaryHover: string
    primarySurface: string
    accent: string
    accentSurface: string
    danger: string
    dangerHover: string
    dangerSurface: string
    warning: string
    warningSurface: string
    success: string
    successSurface: string
    info: string
    infoSurface: string
    focus: string
    overlay: string
  }
  font: {
    display: string
    body: string
  }
  typography: {
    fontFamily: string
    fontFamilyMonospace: string
    headings: Record<
      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
      { fontSize: string; fontWeight: string; lineHeight: string }
    >
  }
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>
  radii: Record<'sm' | 'md' | 'lg' | 'xl' | 'pill', string>
  shadows: Record<'sm' | 'md' | 'lg', string>
  transitions: Record<'fast' | 'normal', string>
  breakpoints: Record<'sm' | 'md' | 'lg' | 'xl', string>
}

/**
 * Registry всех доступных тем.
 * Новые темы, включая будущие темы plugins и пользователя, расширяют этот
 * registry и сохраняют полный контракт AppTheme.
 */
export const themes: Record<ThemeName, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
  sepia: lightTheme,
  midnight: darkTheme,
}

/** Тема по умолчанию для корневого ThemeProvider. */
export const theme = themes.light
