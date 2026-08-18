export type AppMode = 'production' | 'development' | 'release'

export interface Task {
  name: string
  run: () => Promise<void> | void
}
