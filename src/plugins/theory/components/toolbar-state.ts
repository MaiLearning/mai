import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'

export type BlockKind = 'paragraph' | 'h1' | 'h2' | 'h3'

export const ALIGN_CYCLE = ['left', 'center', 'right'] as const

/** Значения состояний до инициализации редактора (editor === null). */
const DEFAULT_STATE = {
  canUndo: false,
  canRedo: false,
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  highlight: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  align: 'left' as (typeof ALIGN_CYCLE)[number],
  block: 'paragraph' as BlockKind,
  codeBlock: false,
  words: 0,
  chars: 0,
}

/** Активные состояния форматирования и счётчики — реактивно читаются из редактора. */
export function useToolbarState(editor: Editor | null) {
  const rawState = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return DEFAULT_STATE

      const headingAttrs = e.getAttributes('heading')
      const paragraphAttrs = e.getAttributes('paragraph')
      const level = typeof headingAttrs.level === 'number' ? headingAttrs.level : null
      const characterCount = e.storage.characterCount as
        | { words: () => number; characters: () => number }
        | undefined

      return {
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
        bold: e.isActive('bold'),
        italic: e.isActive('italic'),
        underline: e.isActive('underline'),
        strike: e.isActive('strike'),
        highlight: e.isActive('highlight'),
        bulletList: e.isActive('bulletList'),
        orderedList: e.isActive('orderedList'),
        blockquote: e.isActive('blockquote'),
        align: (paragraphAttrs.textAlign ??
          headingAttrs.textAlign ??
          'left') as (typeof ALIGN_CYCLE)[number],
        block:
          level === 1
            ? ('h1' as const)
            : level === 2
              ? ('h2' as const)
              : level === 3
                ? ('h3' as const)
                : ('paragraph' as const),
        codeBlock: e.isActive('codeBlock'),
        words: characterCount?.words() ?? 0,
        chars: characterCount?.characters() ?? 0,
      }
    },
  })

  return rawState ?? DEFAULT_STATE
}

/** Количество слов в документе — для показателя времени чтения в шапке. */
export function useWordCount(editor: Editor | null) {
  const raw = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return 0

      const characterCount = e.storage.characterCount as { words: () => number } | undefined

      return characterCount?.words() ?? 0
    },
  })

  return raw ?? 0
}
