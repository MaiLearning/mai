import { invoke } from '@tauri-apps/api/core'
import type { TheoryContent } from '../core/model'

export function fetchTheoryContent(resourceId: string): Promise<TheoryContent> {
  return invoke<TheoryContent>('get_theory_content', { resourceId })
}
