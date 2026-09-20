import { getAppConfig } from '@mai/config'
import type { AppMode, Task } from './types'

export class Runner {
  private tasks: Array<{ task: Task; modes: AppMode[] }> = []

  register(task: Task, mode: AppMode | AppMode[]): void {
    const modes = Array.isArray(mode) ? mode : [mode]
    this.tasks.push({ task, modes })
  }

  /** Активный режим приложения — из единого конфига (@mai/config). */
  get current(): AppMode {
    return getAppConfig().mode
  }

  async run(): Promise<void> {
    for (const { task, modes } of this.tasks) {
      // Режим проверяется на лету: initConfigTask (первой) обновляет конфиг,
      // поэтому последующие таски фильтруются уже по актуальному режиму.
      if (!modes.includes(this.current)) continue

      try {
        await task.run()
      } catch (error) {
        console.error(`[Runner] Task "${task.name}" failed:`, error)
      }
    }
  }
}
