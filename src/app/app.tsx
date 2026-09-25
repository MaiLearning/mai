import { configReadyAtom } from '@mai/config'
import { courseI18NResources } from '@mai/course'
import { I18nProvider, initI18n } from '@mai/i18n'
import { NotificationsHost } from '@mai/notifications'
import { pluginI18NResources } from '@mai/plugin'
import { settingsI18NResources, settingsReadyAtom, useSystemTheme } from '@mai/settings'
import { sidebarI18NResources } from '@mai/sidebar'
import { ThemeProvider } from '@mai/theme'
import { linkI18NResources } from '@mai-plugin/link'
import { theoryI18NResources } from '@mai-plugin/theory'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { homeI18NResources } from '@/pages/home/locales'
import { AppRouter } from './router'
import { Runner } from './runner'
import { initConfigTask } from './runner/task/init_config'
import { initEventsTask } from './runner/task/init_events'
import { initLoggerTask } from './runner/task/init_logger'
import { initPluginsTask } from './runner/task/init_plugins'
import { initSettingsTask } from './runner/task/init_settings'

// Синхронно до первого рендера: к моменту paint переводы уже на месте.
initI18n({
  resources: {
    course: courseI18NResources,
    home: homeI18NResources,
    sidebar: sidebarI18NResources,
    plugin: pluginI18NResources,
    settings: settingsI18NResources,
    link: linkI18NResources,
    theory: theoryI18NResources,
  },
})

/**
 * Корневой компонент всего приложения.
 * Основное назначение - управлять и конфигурировать весь GUI.
 */
export default function Application() {
  // Пока конфиг и настройки не загружены, потребители не должны работать:
  // fake-режим, тема, язык и роутинг зависят от активного режима/настроек.
  const configReady = useAtomValue(configReadyAtom)
  const settingsReady = useAtomValue(settingsReadyAtom)
  const theme = useSystemTheme()

  useEffect(() => {
    const runner = new Runner()

    runner.register(initConfigTask, ['development', 'production', 'release'])
    runner.register(initLoggerTask, ['development', 'production', 'release'])
    runner.register(initPluginsTask, ['development', 'production', 'release'])
    runner.register(initEventsTask, ['development', 'production', 'release'])
    runner.register(initSettingsTask, ['development', 'production', 'release'])

    runner.run()
  }, [])

  if (!configReady || !settingsReady) return null

  return (
    <ThemeProvider theme={theme}>
      <I18nProvider>
        <NotificationsHost />
        <RouterProvider router={AppRouter} />
      </I18nProvider>
    </ThemeProvider>
  )
}
