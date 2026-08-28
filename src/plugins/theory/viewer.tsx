import { error as logError } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { updateResource } from '@/entities/resource/services'
import type { PluginRenderProps } from '@/features/plugin/core/types'
import { notifyError, notifySuccess } from '@/utils/notifications'
import { TheoryAside } from './components/TheoryAside'
import { TheoryHeader } from './components/TheoryHeader'
import { TheoryStatusBar } from './components/TheoryStatusBar'
import { type InsertDialogKind, TheoryToolbar } from './components/TheoryToolbar'
import { useWordCount } from './components/toolbar-state'
import { UrlDialog, type UrlDialogState } from './components/UrlDialog'
import { applyInsertDialog } from './lib/insert-dialog'
import {
  extractOutline,
  type OutlineEntry,
  resolveActiveOutlineIndex,
  scrollToOutlineIndex,
} from './lib/outline'
import { useTheoryAutosave } from './lib/useTheoryAutosave'
import { useTheoryEditor } from './lib/useTheoryEditor'
import {
  Body,
  Canvas,
  InsertButton,
  InsertLine,
  InsertRow,
  Prose,
  Sheet,
  ViewerRoot,
} from './viewer.style'

/**
 * TheoryViewer — WYSIWYG-редактор теоретических материалов на TipTap.
 *
 * Компоновка повторяет дизайн-макет theory-viewer: шапка с названием и метаданными,
 * панель инструментов, лист документа по центру, боковая структура и строка состояния.
 * Контент загружается из backend и автосохраняется с дебаунсом (см. lib/useTheory*).
 */
export function TheoryViewer({ resourceId, courseId, data, onReady }: PluginRenderProps) {
  const { t } = useTranslation('theory')

  const [title, setTitle] = useState(data?.name ?? '')
  const [dialog, setDialog] = useState<UrlDialogState | null>(null)
  const [outline, setOutline] = useState<OutlineEntry[]>([])
  const [activeOutline, setActiveOutline] = useState(-1)

  const savedTitleRef = useRef(data?.name ?? '')
  const canvasRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  const { saveState, updatedAt, setUpdatedAt, scheduleSave } = useTheoryAutosave(resourceId)
  const { editor } = useTheoryEditor({
    resourceId,
    onDocChange: scheduleSave,
    onReady: () => onReadyRef.current?.(),
    onContentLoaded: (record) => setUpdatedAt(record.updatedAt),
    onLoadFailed: () => notifyError(t('load_failed_title'), t('load_failed_hint')),
  })

  // При смене ресурса возвращаем прокрутку документа наверх.
  useEffect(() => {
    canvasRef.current?.scrollTo({ top: 0 })
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

  // ── Название ресурса ─────────────────────────────────────────────────────

  const words = useWordCount(editor)

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
      if (editor && kind) applyInsertDialog(editor, kind, url)
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
        words={words}
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
