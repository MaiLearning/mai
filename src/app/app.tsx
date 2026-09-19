import { courseI18NResources } from '@mai/course'
import { I18nProvider, initI18n } from '@mai/i18n'
import { NotificationsHost } from '@mai/notifications'
import { pluginI18NResources } from '@mai/plugin'
import { sidebarI18NResources } from '@mai/sidebar'
import { ThemeProvider } from '@mai/theme'
import { linkI18NResources } from '@mai-plugin/link'
import { theoryI18NResources } from '@mai-plugin/theory'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppRouter } from './router'
import { Runner } from './runner'
import { initEventsTask } from './runner/task/init_events'
import { initLoggerTask } from './runner/task/init_logger'
import { initPluginsTask } from './runner/task/init_plugins'

// Синхронно до первого рендера: к моменту paint переводы уже на месте.
initI18n({
  resources: {
    course: courseI18NResources,
    sidebar: sidebarI18NResources,
    plugin: pluginI18NResources,
    link: linkI18NResources,
    theory: theoryI18NResources,
  },
})

/**
 * Корневой компонент всего приложения.
 * Основное назначение - управлять и конфигурировать весь GUI.
 */
export default function Application() {
  useEffect(() => {
    const runner = new Runner()

    runner.register(initLoggerTask, ['development', 'production', 'release'])
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
