import { loadPlugins, setInternalViewers } from '@mai/plugin'
import { LinkViewer } from '@mai-plugin/link'
import { TaskViewer } from '@mai-plugin/task'
import { TheoryViewer } from '@mai-plugin/theory'
import type { Task } from '../types'

/**
 * Регистрирует вьюверы internal-плагинов и загружает
 * записи плагинов из backend в рантайм-реестр.
 */
export const initPluginsTask: Task = {
  name: 'init-plugins',
  async run() {
    setInternalViewers({
      theory: TheoryViewer,
      task: TaskViewer,
      link: LinkViewer,
    })
    await loadPlugins()
  },
}
