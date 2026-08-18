import type { AppMode, Task } from './types'

export class Runner {
  private tasks: Array<{ task: Task; modes: AppMode[] }> = []
  current: AppMode = 'development'

  register(task: Task, mode: AppMode | AppMode[]): void {
    const modes = Array.isArray(mode) ? mode : [mode]
    this.tasks.push({ task, modes })
  }

  async run(): Promise<void> {
    const matching = this.tasks.filter((t) => t.modes.includes(this.current))

    for (const { task } of matching) {
      try {
        await task.run()
      } catch (error) {
        console.error(`[Runner] Task "${task.name}" failed:`, error)
      }
    }
  }
}
