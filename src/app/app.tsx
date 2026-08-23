import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { I18nProvider } from '@/app/i18n'
import { SafeAreaProvider } from '@/layouts'
import { appConfig } from './config'
import AppRouter from './router'
import { Runner } from './runner'
import { initLoggerTask } from './runner/task/init_logger'
import { initPluginsTask } from './runner/task/init_plugins'
import { ThemeProvider } from './theme'

/**
 * Корневой компонент всего приложения.
 * Основное назначение — управлять и конфигурировать весь GUI.
 */
export default function Application() {
  useEffect(() => {
    const runner = new Runner()

    runner.register(initLoggerTask, ['development', 'production', 'release'])
    runner.register(initPluginsTask, ['development', 'production', 'release'])

    runner.current = appConfig.mode
    runner.run()
  }, [])

  return (
    <ThemeProvider>
      <I18nProvider>
        <SafeAreaProvider>
          <RouterProvider router={AppRouter} />
        </SafeAreaProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
