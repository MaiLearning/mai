import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { AppThemeContext } from './context'
import { GlobalStyle } from './global-style'
import { type ThemeName, type ThemePreference, themes } from './theme'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Провайдер темы приложения.
 * Передает полноценный theme object через styled-components без CSS variables.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>('system')
  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  const themeName: ThemeName =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  const activeTheme = themes[themeName]
  const context = useMemo(
    () => ({
      theme: activeTheme,
      themeName,
      preference,
      setTheme: setPreference,
      isDark: themeName === 'dark',
    }),
    [activeTheme, preference, themeName],
  )

  return (
    <StyledComponentsThemeProvider theme={activeTheme}>
      <GlobalStyle />
      <Toaster position="bottom-right" />
      <AppThemeContext.Provider value={context}>{children}</AppThemeContext.Provider>
    </StyledComponentsThemeProvider>
  )
}
