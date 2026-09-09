import { createContext } from 'react'
import type { SettingsTheme } from '@/entities/settings'
import type { AppTheme, ThemeName } from './theme'

export interface AppThemeContextValue {
  theme: AppTheme
  themeName: ThemeName
  /** Выбранная тема из настроек приложения. */
  preference: SettingsTheme
  setTheme: (theme: SettingsTheme) => void
  isDark: boolean
}

export const AppThemeContext = createContext<AppThemeContextValue | null>(null)
