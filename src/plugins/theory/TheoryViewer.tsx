import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { type JSONContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useRef, useState } from 'react'
import { i18next, useTranslation } from '@/app/i18n'
import { updateResource } from '@/entities/resource/services'
import { fetchTheoryContent, saveTheoryContent } from '@/entities/theory-plugin/services'
import type { PluginRenderProps } from '@/features/plugin/core/types'
import { info, error as logError } from '@/utils/logger'
import { notifyError, notifySuccess } from '@/utils/notifications'
import { TheoryAside } from './components/TheoryAside'
import { TheoryHeader } from './components/TheoryHeader'
import { TheoryStatusBar } from './components/TheoryStatusBar'
import { type InsertDialogKind, TheoryToolbar } from './components/TheoryToolbar'
import { UrlDialog, type UrlDialogState } from './components/UrlDialog'
import {
  extractOutline,
  type OutlineEntry,
  resolveActiveOutlineIndex,
  scrollToOutlineIndex,
} from './lib/outline'
import { CalloutNode } from './nodes/CalloutNode'
import { EmbedNode } from './nodes/EmbedNode'
import { FormulaNode } from './nodes/FormulaNode'
import { InsertButton, InsertLine, InsertRow, Prose } from './styles/content.style'
import { Body, Canvas, Sheet, ViewerRoot } from './styles/layout.style'

/** Пустой документ TipTap — один абзац. */
const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

/** Задержка дебаунса автосохранения. */
const SAVE_DEBOUNCE_MS = 500

/** Проверяет, что распарсенный контент выглядит как документ TipTap. */
function isTipTapDoc(value: unknown): value is JSONContent {
  if (typeof value !== 'object' || value === null) return false
  const doc = value as { type?: unknown; content?: unknown }

  return doc.type === 'doc' && Array.isArray(doc.content)
}

/**
 * TheoryViewer — WYSIWYG-редактор теоретических материалов на TipTap.
 *
 * Компоновка повторяет дизайн-макет theory-viewer: шапка с названием и метаданными,
 * панель инструментов, лист документа по центру, боковая структура и строка состояния.
 * Контент загружается из backend и автосохраняется с дебаунсом.
 */
export function TheoryViewer({ resourceId, courseId, data, onReady }: PluginRenderProps) {
  const { t } = useTranslation('theory')

  const [title, setTitle] = useState(data?.name ?? '')
  const [preview, setPreview] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [dialog, setDialog] = useState<UrlDialogState | null>(null)
  const [outline, setOutline] = useState<OutlineEntry[]>([])
  const [activeOutline, setActiveOutline] = useState(-1)

  const loadedRef = useRef(false)
  const pendingRef = useRef<JSONContent | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTitleRef = useRef(data?.name ?? '')
  const canvasRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  // ── Автосохранение ───────────────────────────────────────────────────────

  const flushSave = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const content = pendingRef.current
    pendingRef.current = null
    if (!content) return

    setSaveState('saving')
    try {
      await saveTheoryContent({ resourceId, content })
      setSaveState('saved')
      setDirty(false)
      setUpdatedAt(Date.now())
      info(`plugins/theory: autosave success (${resourceId})`)
    } catch (e) {
      logError(`plugins/theory: save content failed: ${e instanceof Error ? e.message : String(e)}`)
      setSaveState('error')
      // Возвращаем контент в очередь — следующее изменение или «Сохранить» повторят попытку.
      pendingRef.current = content
    }
  }, [resourceId])

  const scheduleSave = useCallback(
    (content: JSONContent) => {
      pendingRef.current = content
      if (saveState !== 'error') setSaveState('idle')
      setDirty(true)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => void flushSave(), SAVE_DEBOUNCE_MS)
    },
    [flushSave, saveState],
  )

  // ── Редактор ─────────────────────────────────────────────────────────────

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

      scheduleSave(current.getJSON())
    },
  })

  // ── Загрузка контента ────────────────────────────────────────────────────

  const [initialDoc, setInitialDoc] = useState<JSONContent | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const record = await fetchTheoryContent(resourceId)
        if (cancelled) return

        setUpdatedAt(record.updatedAt)
        setInitialDoc(isTipTapDoc(record.content) ? record.content : EMPTY_DOC)
        onReadyRef.current?.()
      } catch (e) {
        logError(
          `plugins/theory: load content failed: ${e instanceof Error ? e.message : String(e)}`,
        )
        if (cancelled) return

        notifyError(t('load_failed_title'), t('load_failed_hint'))
        setInitialDoc(EMPTY_DOC)
        onReadyRef.current?.()
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [resourceId, t])

  // Применяем загруженный документ к редактору, когда он создан.
  useEffect(() => {
    if (!editor || !initialDoc) return

    editor.commands.setContent(initialDoc, { emitUpdate: false })
    loadedRef.current = true
  }, [editor, initialDoc])

  // Режим предпросмотра переключает editable.
  useEffect(() => {
    editor?.setEditable(!preview)
  }, [editor, preview])

  // Финальное сохранение при размонтировании / смене ресурса.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)

      const pending = pendingRef.current
      pendingRef.current = null
      if (!pending) return

      saveTheoryContent({ resourceId, content: pending }).catch((e) => {
        logError(`plugins/theory: final save failed: ${e instanceof Error ? e.message : String(e)}`)
      })
    }
  }, [resourceId])

  // ── Структура документа (outline) ────────────────────────────────────────

  useEffect(() => {
    if (!editor) return

    const update = () => setOutline(extractOutline(editor.state.doc))
    update()
    editor.on('update', update)

    return () => {
      editor.off('update', update)
    }
  }, [editor])

  const handleCanvasScroll = useCallback(() => {
    const el = canvasRef.current
    if (el) setActiveOutline(resolveActiveOutlineIndex(el))
  }, [])

  const handleSelectOutline = useCallback((index: number) => {
    const el = canvasRef.current
    if (el) scrollToOutlineIndex(el, index)
  }, [])

  // Пересчитываем активный раздел после изменения структуры.
  useEffect(() => {
    handleCanvasScroll()
  }, [outline, handleCanvasScroll])

  // ── Счётчики для шапки ───────────────────────────────────────────────────

  const rawCounts = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return { words: 0, chars: 0 }

      const characterCount = e.storage.characterCount as
        | { words: () => number; characters: () => number }
        | undefined

      return {
        words: characterCount?.words() ?? 0,
        chars: characterCount?.characters() ?? 0,
      }
    },
  })
  const counts = rawCounts ?? { words: 0, chars: 0 }

  // ── Название ресурса ─────────────────────────────────────────────────────

  const commitTitle = useCallback(async () => {
    const name = title.trim()
    if (!data || !name || name === savedTitleRef.current) return

    try {
      await updateResource({ resourceId, courseId, name, typeKey: data.typeKey })
      savedTitleRef.current = name
      notifySuccess(t('rename_success_title'), t('rename_success_message', { name }))
    } catch (e) {
      logError(
        `plugins/theory: rename resource failed: ${e instanceof Error ? e.message : String(e)}`,
      )
      notifyError(t('rename_failed_title'))
      setTitle(savedTitleRef.current)
    }
  }, [title, data, resourceId, courseId, t])

  // ── Диалог вставки URL ───────────────────────────────────────────────────

  const openDialog = useCallback(
    (kind: InsertDialogKind) => {
      const initial =
        kind === 'link' && editor ? String(editor.getAttributes('link').href ?? '') : ''

      setDialog({ kind, initial })
    },
    [editor],
  )

  const handleDialogSubmit = useCallback(
    (url: string) => {
      const kind = dialog?.kind
      setDialog(null)
      if (!editor || !kind) return

      if (kind === 'link') {
        const chain = editor.chain().focus()
        if (!url) {
          chain.extendMarkRange('link').unsetLink().run()

          return
        }
        if (editor.state.selection.empty) {
          chain
            .insertContent([
              { type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url } }] },
            ])
            .run()
        } else {
          chain.extendMarkRange('link').setLink({ href: url }).run()
        }

        return
      }

      if (kind === 'image') {
        editor.chain().focus().setImage({ src: url }).run()

        return
      }

      editor.chain().focus().insertEmbed({ url }).run()
    },
    [dialog, editor],
  )

  // ── Действия ─────────────────────────────────────────────────────────────

  function insertBlockAtEnd() {
    editor?.chain().focus('end').insertContent({ type: 'paragraph' }).run()
  }

  function insertFormulaAtEnd() {
    editor?.chain().focus('end').insertFormula().run()
  }

  return (
    <ViewerRoot>
      <TheoryHeader
        courseId={courseId}
        resource={data}
        title={title}
        onTitleChange={setTitle}
        onTitleCommit={() => void commitTitle()}
        preview={preview}
        onTogglePreview={() => setPreview((v) => !v)}
        onSave={() => void flushSave()}
        dirty={dirty}
        saving={saveState === 'saving'}
        words={counts.words}
        chars={counts.chars}
        updatedAt={updatedAt}
      />

      <TheoryToolbar editor={editor} onRequestDialog={openDialog} />

      <Body>
        <Canvas ref={canvasRef} onScroll={handleCanvasScroll}>
          <Sheet>
            <Prose editor={editor} />

            <InsertRow>
              <InsertLine />
              <InsertButton type="button" onClick={insertBlockAtEnd}>
                + {t('insert_row_block')}
              </InsertButton>
              <InsertButton type="button" onClick={() => openDialog('image')}>
                {t('insert_row_media')}
              </InsertButton>
              <InsertButton type="button" onClick={insertFormulaAtEnd}>
                {t('insert_row_formula')}
              </InsertButton>
              <InsertLine />
            </InsertRow>
          </Sheet>
        </Canvas>

        <TheoryAside entries={outline} activeIndex={activeOutline} onSelect={handleSelectOutline} />
      </Body>

      <TheoryStatusBar saveState={saveState} />

      <UrlDialog state={dialog} onClose={() => setDialog(null)} onSubmit={handleDialogSubmit} />
    </ViewerRoot>
  )
}
