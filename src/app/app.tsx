import { I18nProvider } from '@mai/i18n'
import { NotificationsHost } from '@mai/notifications'
import { ThemeProvider } from '@mai/theme'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './router'
import { Runner } from './runner'
import { initEventsTask } from './runner/task/init_events'
import { initI18nTask } from './runner/task/init_i18n'
import { initLoggerTask } from './runner/task/init_logger'
import { initPluginsTask } from './runner/task/init_plugins'

/**
 * Корневой компонент всего приложения.
 * Основное назначение - управлять и конфигурировать весь GUI.
 */
export default function Application() {
  useEffect(() => {
    const runner = new Runner()

    runner.register(initLoggerTask, ['development', 'production', 'release'])
    runner.register(initI18nTask, ['development', 'production', 'release'])
    runner.register(initPluginsTask, ['development', 'production', 'release'])
    runner.register(initEventsTask, ['development', 'production', 'release'])

    runner.run()
  }, [])

  return (
    <ThemeProvider>
      <I18nProvider>
        <NotificationsHost />
        <RouterProvider router={AppRouter} />
      </I18nProvider>
    </ThemeProvider>
  )
}
