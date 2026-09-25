import { useTranslation } from '@mai/i18n'
import { notifyError, notifySuccess } from '@mai/notifications'
import type { PluginRenderProps } from '@mai/plugin'
import { updateResource } from '@mai/resource'
import { error as logError } from '@mai/tauri/logs'
import { Spinner } from '@mai/theme'
import type { JSONContent } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffectiveAutosaveDelay } from '../settings/useEffectiveAutosaveDelay'
import { TheoryHeader } from './components/TheoryHeader'
import { TheoryStatusBar } from './components/TheoryStatusBar'
import { type InsertDialogKind, TheoryToolbar } from './components/TheoryToolbar'
import { useToolbarState } from './components/toolbar-state'
import { UrlDialog, type UrlDialogState } from './components/UrlDialog'
import { WikiSuggestMenu } from './components/WikiSuggestMenu'
import { setWikiCourse } from './lib/course-resources'
import { applyInsertDialog } from './lib/insert-dialog'
import { useTheoryAutosave } from './lib/useTheoryAutosave'
import { isTipTapDoc, useTheoryEditor } from './lib/useTheoryEditor'
import { refreshWikiStatuses, syncWikiEdges } from './lib/wiki-links'
import { setWikiNavigator } from './lib/wiki-navigation'
import { wikiPopup } from './lib/wiki-popup'
import {
  Body,
  Canvas,
  CanvasWrap,
  InsertButton,
  InsertLine,
  InsertRow,
  LoadOverlay,
  Prose,
  Sheet,
  ViewerRoot,
} from './viewer.style'

/** TheoryViewer — WYSIWYG-редактор теории на TipTap (шапка, тулбар, лист по центру, статус-бар). */
export function TheoryViewer({ resourceId, courseId, data, onReady }: PluginRenderProps) {
  const { t } = useTranslation('theory')
  const [title, setTitle] = useState(data?.name ?? '')
  const [dialog, setDialog] = useState<UrlDialogState | null>(null)

  const savedTitleRef = useRef(data?.name ?? '')
  const canvasRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const navigate = useNavigate()

  // ── Контекст wiki-ссылок (курс + навигация) и меню автокомплита ──────────
  useEffect(() => {
    setWikiNavigator(navigate)
  }, [navigate])

  useEffect(() => {
    setWikiCourse(courseId)
  }, [courseId])

  const wikiPopupState = useSyncExternalStore(
    wikiPopup.subscribe,
    wikiPopup.getSnapshot,
    wikiPopup.getServerSnapshot,
  )

  const handleSaved = useCallback(
    (content: JSONContent) => {
      void syncWikiEdges({ courseId, resourceId, doc: content })
    },
    [courseId, resourceId],
  )
  const autosaveDelay = useEffectiveAutosaveDelay()
  const { saveState, updatedAt, setUpdatedAt, scheduleSave, flushSave } = useTheoryAutosave({
    resourceId,
    debounceMs: autosaveDelay,
    onSaved: handleSaved,
  })
  const { editor, loading } = useTheoryEditor({
    resourceId,
    onDocChange: scheduleSave,
    onReady: () => onReadyRef.current?.(),
    onContentLoaded: (record) => {
      setUpdatedAt(record.updatedAt)
      void refreshWikiStatuses(resourceId)
      if (isTipTapDoc(record.content)) {
        void syncWikiEdges({ courseId, resourceId, doc: record.content })
      }
    },
    onLoadFailed: () => notifyError(t('load_failed_title'), t('load_failed_hint')),
  })

  // При смене ресурса возвращаем прокрутку документа наверх.
  useEffect(() => {
    canvasRef.current?.scrollTo({ top: 0 })
  }, [resourceId])

  // ── Ручное сохранение (Ctrl/Cmd+S) ───────────────────────────────────────
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        void flushSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [flushSave])

  // ── Название ресурса ─────────────────────────────────────────────────────
  const toolbarState = useToolbarState(editor)
  const words = toolbarState.words

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

      <TheoryToolbar editor={editor} state={toolbarState} onRequestDialog={openDialog} />

      <Body>
        <CanvasWrap>
          <Canvas ref={canvasRef}>
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
          {loading && (
            <LoadOverlay aria-busy="true">
              <Spinner label={t('content_loading')} />
            </LoadOverlay>
          )}
        </CanvasWrap>
      </Body>
      <TheoryStatusBar saveState={saveState} onRetry={flushSave} />
      {wikiPopupState.open && (
        <WikiSuggestMenu
          items={wikiPopupState.items}
          selected={wikiPopupState.selected}
          rect={wikiPopupState.rect}
          onPick={(item) => wikiPopup.pick(item)}
        />
      )}
      <UrlDialog state={dialog} onClose={() => setDialog(null)} onSubmit={handleDialogSubmit} />
    </ViewerRoot>
  )
}
