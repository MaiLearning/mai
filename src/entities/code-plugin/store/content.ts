import { atom } from 'jotai'
import type { CodeContentData, UpdateCodeContentInput } from '../core/model'
import { updateCodeContent } from '../services/content'
import { codeSnapshotsAtom } from './atoms'

/**
 * Сохранение контента целиком: backend отдаёт свежий снапшот — он
 * замещает запись в атоме (updatedAt и дефолты приходят с backend).
 */
export const saveCodeContentAtom = atom(
  null,
  async (_get, set, input: UpdateCodeContentInput): Promise<CodeContentData> => {
    const snapshot = await updateCodeContent(input)
    set(codeSnapshotsAtom, (prev) => ({ ...prev, [input.resourceId]: snapshot }))

    return snapshot
  },
)
