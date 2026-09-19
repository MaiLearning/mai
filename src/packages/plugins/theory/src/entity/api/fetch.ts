// Получение содержимого теории ресурса.
import { invoke } from '@mai/tauri/ipc'
import type { TheoryContent } from '../core/model'

export function fetchTheoryContent(resourceId: string): Promise<TheoryContent> {
  return invoke<TheoryContent>('get_theory_content', { resourceId })
}
