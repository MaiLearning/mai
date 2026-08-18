import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './theme'
import { Runner } from './runner'
import { appConfig } from './config'
import { initLoggerTask } from './runner/task/init_logger'
import { initPluginsTask } from './runner/task/init_external_plugins'
import AppRouter from './router'
import { SafeAreaProvider } from '@/layouts'

/**
 * Корневой компонент всего приложения.
 * Основное назначение — управлять и конфигурировать весь GUI.
 */
export default function Application() {
  useEffect(() => {
    const runner = new Runner()

    runner.register(initLoggerTask, 'development')
    runner.register(initPluginsTask, ['development', 'production', 'release'])

    runner.current = appConfig.mode
    runner.run()
  }, [])

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RouterProvider router={AppRouter} />
      </SafeAreaProvider>
    </ThemeProvider>
  )
}
