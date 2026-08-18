import { invoke } from '@tauri-apps/api/core'
import type { TheoryContent } from '../core/model'

export function sendSaveTheoryContent(
  resourceId: string,
  content: Record<string, unknown>,
): Promise<TheoryContent> {
  return invoke<TheoryContent>('save_theory_content', { resourceId, content })
}
