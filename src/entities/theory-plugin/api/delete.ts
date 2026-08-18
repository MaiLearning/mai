import { invoke } from '@tauri-apps/api/core'
import type { TheoryContent } from '../core/model'

export function sendClearTheoryContent(resourceId: string): Promise<TheoryContent> {
  return invoke<TheoryContent>('clear_theory_content', { resourceId })
}

export function sendDeleteTheoryContent(resourceId: string): Promise<TheoryContent> {
  return invoke<TheoryContent>('delete_theory_content', { resourceId })
}
