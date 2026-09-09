import { error as logError } from '@tauri-apps/plugin-log'
import { useAtomValue, useSetAtom } from 'jotai'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import {
  DEFAULT_SETTINGS,
  type SettingsTheme,
  settingsAtom,
  updateSettingsAtom,
} from '@/entities/settings'
import { notifyError } from '@/utils/notifications'
import { AppThemeContext } from './context'
import { GlobalStyle } from './global-style'
import { type ThemeName, themes } from './theme'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Провайдер темы приложения.
 * Выбор темы читается из настроек (settingsAtom) реактивно: загрузка
 * настроек и их изменение применяются автоматически. До загрузки —
 * DEFAULT_SETTINGS.theme.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const settings = useAtomValue(settingsAtom)
  const updateSettings = useSetAtom(updateSettingsAtom)
  const preference: SettingsTheme = settings?.theme ?? DEFAULT_SETTINGS.theme

  const systemDark = useSystemDark()

  const themeName: ThemeName =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  const activeTheme = themes[themeName]

  const setTheme = useCallback(
    (theme: SettingsTheme) => {
      updateSettings({ theme }).catch((e) => {
        const message = e instanceof Error ? e.message : String(e)
        logError(`Не удалось сохранить тему: ${message}`)
        notifyError('Не удалось сохранить тему')
      })
    },
    [updateSettings],
  )

  const context = useMemo(
    () => ({
      theme: activeTheme,
      themeName,
      preference,
      setTheme,
      isDark: themeName === 'dark',
    }),
    [activeTheme, preference, themeName, setTheme],
  )

  return (
    <StyledComponentsThemeProvider theme={activeTheme}>
      <GlobalStyle />
      <Toaster position="bottom-right" />
      <AppThemeContext.Provider value={context}>{children}</AppThemeContext.Provider>
    </StyledComponentsThemeProvider>
  )
}

/** Подписка на системную цветовую схему (тема 'system'). */
function useSystemDark(): boolean {
  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  return systemDark
}
