import { i18next } from '@mai/i18n'
import { error as logError } from '@mai/tauri/logs'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState } from 'react'
import type { TheoryContent } from '../../entity'
import { fetchTheoryContent } from '../../entity/services'
import { CalloutNode } from '../nodes/CalloutNode'
import { EmbedNode } from '../nodes/EmbedNode'
import { FormulaNode } from '../nodes/FormulaNode'
import { WikiLinkNode } from '../nodes/WikiLinkNode'
import { openExternal } from './open-external'
import { WikiSuggest } from './wiki-suggestions'

/** Пустой документ TipTap — один абзац (каждый вызов — новый объект). */
function emptyDoc(): JSONContent {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

/** Проверяет, что распарсенный контент выглядит как документ TipTap. */
export function isTipTapDoc(value: unknown): value is JSONContent {
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

/**
 * Создаёт редактор TipTap с расширениями теории и загружает контент ресурса.
 *
 * До окончания загрузки редактор переведён в read-only (нельзя набрать текст,
 * который затем молча перезатрётся контентом с backend).
 */
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
  const [loading, setLoading] = useState(true)

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
      WikiLinkNode,
      WikiSuggest,
    ],
    content: emptyDoc(),
    autofocus: false,
    editable: false,
    editorProps: {
      attributes: { spellcheck: 'false' },
      // Ctrl/Cmd+Click по инлайн-ссылке открывает её во внешнем браузере.
      handleClick: (_view, _pos, event) => {
        if (!(event.ctrlKey || event.metaKey)) return false

        const anchor = (event.target as HTMLElement | null)?.closest('a')
        const href = anchor?.getAttribute('href')
        if (!href) return false

        void openExternal(href)

        return true
      },
    },
    onUpdate: ({ editor: current }) => {
      if (!loadedRef.current) return

      onDocChangeRef.current(current.getJSON())
    },
  })

  // Загружаем контент с backend и применяем к созданному редактору.
  const [initialDoc, setInitialDoc] = useState<JSONContent | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadedRef.current = false

    async function load() {
      try {
        const record = await fetchTheoryContent(resourceId)
        if (cancelled) return

        setInitialDoc(isTipTapDoc(record.content) ? record.content : emptyDoc())
        onContentLoadedRef.current(record)
      } catch (e) {
        logError(
          `plugins/theory: load content failed: ${e instanceof Error ? e.message : String(e)}`,
        )
        if (cancelled) return

        setInitialDoc(emptyDoc())
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
    editor.setEditable(true)
    loadedRef.current = true
    setLoading(false)
  }, [editor, initialDoc])

  return { editor, loading }
}
