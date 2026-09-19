import { useContext } from 'react'
import { AppThemeContext } from './context'

/**
 * Доступ к выбранной теме приложения.
 * ThemeProvider передает полноценный theme object без CSS variables.
 */
export function useAppTheme() {
  const context = useContext(AppThemeContext)
  if (!context) throw new Error('useAppTheme must be used inside ThemeProvider')

  return context
}

/** Временный alias для мигрируемых компонентов. */
export const useColorScheme = useAppTheme
