import { isFakeDataEnabled } from '@mai/fakeData'
import { loadPlugins, setInternalViewers } from '@mai/plugin'
import { LinkViewer } from '@mai-plugin/link'
import { TaskViewer } from '@mai-plugin/task'
import { TheoryViewer } from '@mai-plugin/theory'
import type { Task } from '../types'

/**
 * Регистрирует вьюверы internal-плагинов и загружает
 * записи плагинов из backend в рантайм-реестр.
 * В fake-режиме backend-записей нет — загружается только реестр вьюверов.
 */
export const initPluginsTask: Task = {
  name: 'init-plugins',
  async run() {
    setInternalViewers({
      theory: TheoryViewer,
      task: TaskViewer,
      link: LinkViewer,
    })
    if (!import.meta.env.DEV || !isFakeDataEnabled()) await loadPlugins()
  },
}
