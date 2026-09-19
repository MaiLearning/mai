import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import type { ThemeMode, ThemeName, ThemePreference } from './context'
import { AppThemeContext } from './context'
import { GlobalStyle } from './globalStyle'
import { getTheme } from './registry'

export interface ThemeProviderProps {
  children: ReactNode
  /** Предпочтение темы: системная, светлая или тёмная. По умолчанию — системная. */
  theme?: ThemePreference
}

const prefersDarkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

/** Резолвит предпочтение в имя реализованной темы. */
function resolveMode(preference: ThemePreference, systemDark: boolean): ThemeMode {
  if (preference === 'system') return systemDark ? 'dark' : 'light'

  return preference
}

/**
 * Провайдер темы: выбирает вариацию дизайна, а затем отдаёт токены
 * в styled-components и через AppThemeContext.
 * Системное предпочтение считывается через prefers-color-scheme и реагирует
 * на смену схемы ОС на лету.
 */
export function ThemeProvider({ children, theme = 'system' }: ThemeProviderProps) {
  const [systemDark, setSystemDark] = useState(() => prefersDarkQuery().matches)

  useEffect(() => {
    const query = prefersDarkQuery()
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)

    return () => query.removeEventListener('change', onChange)
  }, [])

  const themeName: ThemeName = 'default'
  const mode = resolveMode(theme, systemDark)
  const resolved = getTheme(themeName, mode)

  return (
    <AppThemeContext.Provider value={{ theme: resolved, themeName, mode }}>
      <StyledThemeProvider theme={resolved}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </AppThemeContext.Provider>
  )
}
