import { createContext } from 'react'
import type { AppTheme, ThemeName, ThemePreference } from './theme'

export interface AppThemeContextValue {
  theme: AppTheme
  themeName: ThemeName
  preference: ThemePreference
  setTheme: (preference: ThemePreference) => void
  isDark: boolean
}

export const AppThemeContext = createContext<AppThemeContextValue | null>(null)
