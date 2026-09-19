import { courseI18NResources } from '@mai/course'
import { initI18n } from '@mai/i18n'
import { pluginI18NResources } from '@mai/plugin'
import { sidebarI18NResources } from '@mai/sidebar'
import { linkI18NResources } from '@mai-plugin/link'
import { theoryI18NResources } from '@mai-plugin/theory'
import type { Task } from '../types'

/** Таска инициализации i18next — вызывается после logger. */
export const initI18nTask: Task = {
  name: 'init-i18n',
  run() {
    initI18n({
      resources: {
        course: courseI18NResources,
        sidebar: sidebarI18NResources,
        plugin: pluginI18NResources,
        link: linkI18NResources,
        theory: theoryI18NResources,
      },
    })
  },
}
