import { createContext } from 'react'
import type { AppTheme } from './theme'
import type { ThemeMode, ThemeName } from './types'

export type { ThemeMode, ThemeName, ThemePreference } from './types'

/**
 * Контекст темы: выбранный дизайн, режим и готовый объект токенов.
 */
export interface AppThemeContextValue {
  theme: AppTheme
  themeName: ThemeName
  mode: ThemeMode
}

export const AppThemeContext = createContext<AppThemeContextValue | null>(null)
