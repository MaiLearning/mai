import { error as logError } from '@tauri-apps/plugin-log'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'
import { i18next } from '@/app/i18n'
import type { TheoryContent } from '@/entities/theory-plugin'
import { fetchTheoryContent } from '@/entities/theory-plugin/services'
import { CalloutNode } from '../nodes/CalloutNode'
import { EmbedNode } from '../nodes/EmbedNode'
import { FormulaNode } from '../nodes/FormulaNode'

/** Пустой документ TipTap — один абзац. */
const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

/** Проверяет, что распарсенный контент выглядит как документ TipTap. */
function isTipTapDoc(value: unknown): value is JSONContent {
  if (typeof value !== 'object' || value === null) return false
  const doc = value as { type?: unknown; content?: unknown }

  return doc.type === 'doc' && Array.isArray(doc.content)
}

interface UseTheoryEditorOptions {
  resourceId: string
  /** Вызывается при каждом изменении документа (только после загрузки контента). */
  onDocChange: (content: JSONContent) => void
  /** Документ загружен и применён к редактору (успех или fallback на пустой). */
  onReady: () => void
  /** Успешная загрузка — метаданные записи (updated_at и т.п.). */
  onContentLoaded: (record: TheoryContent) => void
  /** Ошибка загрузки — контент заменён пустым документом. */
  onLoadFailed: () => void
}

/** Создаёт редактор TipTap с расширениями теории и загружает контент ресурса. */
export function useTheoryEditor({
  resourceId,
  onDocChange,
  onReady,
  onContentLoaded,
  onLoadFailed,
}: UseTheoryEditorOptions) {
  const onDocChangeRef = useRef(onDocChange)
  onDocChangeRef.current = onDocChange
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onContentLoadedRef = useRef(onContentLoaded)
  onContentLoadedRef.current = onContentLoaded
  const onLoadFailedRef = useRef(onLoadFailed)
  onLoadFailedRef.current = onLoadFailed
  const loadedRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false },
      }),
      Highlight,
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: () => i18next.t('theory:placeholder'),
      }),
      CharacterCount,
      CalloutNode,
      FormulaNode,
      EmbedNode,
    ],
    content: EMPTY_DOC,
    autofocus: false,
    editorProps: { attributes: { spellcheck: 'false' } },
    onUpdate: ({ editor: current }) => {
      if (!loadedRef.current) return

      onDocChangeRef.current(current.getJSON())
    },
  })

  // Загружаем контент с backend и применяем к созданному редактору.
  const [initialDoc, setInitialDoc] = useState<JSONContent | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const record = await fetchTheoryContent(resourceId)
        if (cancelled) return

        setInitialDoc(isTipTapDoc(record.content) ? record.content : EMPTY_DOC)
        onContentLoadedRef.current(record)
      } catch (e) {
        logError(
          `plugins/theory: load content failed: ${e instanceof Error ? e.message : String(e)}`,
        )
        if (cancelled) return

        setInitialDoc(EMPTY_DOC)
        onLoadFailedRef.current()
      }

      if (!cancelled) onReadyRef.current()
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [resourceId])

  useEffect(() => {
    if (!editor || !initialDoc) return

    editor.commands.setContent(initialDoc, { emitUpdate: false })
    loadedRef.current = true
  }, [editor, initialDoc])

  return { editor }
}
