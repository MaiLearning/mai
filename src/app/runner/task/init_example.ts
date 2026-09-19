import type { Task } from '../types'

/**
 * Это пример того как надо создавать Task-и который будут выполнены при открытии приложения
 */
export const initExampleTask: Task = {
  // Имя задачи
  name: 'init-example',
  // Функция что будет выполнена
  async run() {
    // ...
  },
}
