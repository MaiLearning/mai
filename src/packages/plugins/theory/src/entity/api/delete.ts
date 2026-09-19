// Очистка и удаление содержимого теории.
import { invoke } from '@mai/tauri/ipc'
import type { TheoryContent } from '../core/model'

export function sendClearTheoryContent(resourceId: string): Promise<TheoryContent> {
  return invoke<TheoryContent>('clear_theory_content', { resourceId })
}

export function sendDeleteTheoryContent(resourceId: string): Promise<TheoryContent> {
  return invoke<TheoryContent>('delete_theory_content', { resourceId })
}
