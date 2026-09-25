import { isFakeDataEnabled } from '@mai/fakeData'
import { loadPlugins, setInternalPluginSettings, setInternalViewers } from '@mai/plugin'
// Viewers
import { CodeViewer } from '@mai-plugin/code'
import { LinkViewer } from '@mai-plugin/link'
import { TaskViewer } from '@mai-plugin/task'
import { TheoryViewer, theorySettingsDefinition } from '@mai-plugin/theory'
import type { Task } from '../types'

/**
 * Регистрирует viewers и settings internal-плагинов и загружает
 * записи плагинов из backend в runtime-реестр.
 * В fake-режиме backend-записей нет — регистрируются только локальные definitions.
 */
export const initPluginsTask: Task = {
  name: 'init-plugins',
  async run() {
    setInternalViewers({
      theory: TheoryViewer,
      task: TaskViewer,
      link: LinkViewer,
      code: CodeViewer,
    })
    setInternalPluginSettings({
      'internal-theory': theorySettingsDefinition,
    })
    if (!import.meta.env.DEV || !isFakeDataEnabled()) await loadPlugins()
  },
}
