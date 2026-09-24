import { useTranslation } from '@mai/i18n'
import { Divider, Tooltip } from '@mai/theme'
import type { Editor } from '@tiptap/core'
import type { LucideIcon } from 'lucide-react'
import {
  AlignLeft,
  Bold,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'
import { BlockSelect } from './BlockSelect'
import { InsertGroup } from './InsertGroup'
import { ToolButton, ToolbarRoot, ToolbarSpacer, ToolGroup, WordCount } from './TheoryToolbar.style'
import { ALIGN_CYCLE, type ToolbarState } from './toolbar-state'

/** Типы диалогов вставки, открываемых из тулбара (реализованы в TheoryViewer). */
export type InsertDialogKind = 'link' | 'image'

export interface TheoryToolbarProps {
  editor: Editor | null
  /** Состояние редактора — один useEditorState на viewer (тут и в шапке). */
  state: ToolbarState
  onRequestDialog: (kind: InsertDialogKind) => void
}

interface ToolItem {
  icon: LucideIcon
  label: string
  active: boolean
  disabled?: boolean
  /** Подсказка горячей клавиши для тултипа (Ctrl+…). */
  hint?: string
  onClick: () => void
}

/** Фабрика элементов тулбара — держит конфиги кнопок однострочными. */
function tool(
  icon: LucideIcon,
  label: string,
  active: boolean,
  onClick: () => void,
  disabled?: boolean,
  hint?: string,
): ToolItem {
  return { icon, label, active, disabled, hint, onClick }
}

/**
 * Панель форматирования: undo/redo, тип блока, начертания, списки/цитата/
 * выравнивание, вставки и счётчик слов. Активные состояния читаются из редактора.
 */
export function TheoryToolbar({ editor, state, onRequestDialog }: TheoryToolbarProps) {
  const { t } = useTranslation('theory')
  const focus = () => editor?.chain().focus()

  function cycleAlign() {
    if (!editor) return
    const index = ALIGN_CYCLE.indexOf(state.align)
    const next = ALIGN_CYCLE[(index + 1) % ALIGN_CYCLE.length]
    const chain = editor.chain().focus()
    if (next === 'left') chain.unsetTextAlign().run()
    else chain.setTextAlign(next).run()
  }

  const historyTools = [
    tool(Undo2, t('undo'), false, () => focus()?.undo().run(), !state.canUndo, 'Ctrl+Z'),
    tool(Redo2, t('redo'), false, () => focus()?.redo().run(), !state.canRedo, 'Ctrl+Y'),
  ]

  const markTools = [
    tool(Bold, t('bold'), state.bold, () => focus()?.toggleBold().run(), undefined, 'Ctrl+B'),
    tool(
      Italic,
      t('italic'),
      state.italic,
      () => focus()?.toggleItalic().run(),
      undefined,
      'Ctrl+I',
    ),
    tool(
      Underline,
      t('underline'),
      state.underline,
      () => focus()?.toggleUnderline().run(),
      undefined,
      'Ctrl+U',
    ),
    tool(
      Strikethrough,
      t('strike'),
      state.strike,
      () => focus()?.toggleStrike().run(),
      undefined,
      'Ctrl+Shift+S',
    ),
    tool(
      Highlighter,
      t('highlight'),
      state.highlight,
      () => focus()?.toggleHighlight().run(),
      undefined,
      'Ctrl+Shift+H',
    ),
  ]

  const blockTools = [
    tool(List, t('bullet_list'), state.bulletList, () => focus()?.toggleBulletList().run()),
    tool(ListOrdered, t('ordered_list'), state.orderedList, () =>
      focus()?.toggleOrderedList().run(),
    ),
    tool(Quote, t('blockquote'), state.blockquote, () => focus()?.toggleBlockquote().run()),
    tool(AlignLeft, t('align'), false, () => cycleAlign()),
  ]

  function renderTools(tools: ToolItem[]) {
    return tools.map((item) => (
      <Tooltip key={item.label} content={item.hint ? `${item.label} (${item.hint})` : item.label}>
        <ToolButton
          type="button"
          aria-label={item.label}
          selected={item.active}
          disabled={item.disabled}
          onClick={item.onClick}
          onlyIcon={<item.icon size={16} />}
        />
      </Tooltip>
    ))
  }

  return (
    <ToolbarRoot role="toolbar" aria-label={t('toolbar_label')}>
      <ToolGroup>{renderTools(historyTools)}</ToolGroup>
      <Divider vertical />
      <BlockSelect editor={editor} current={state.block} />
      <Divider vertical />
      <ToolGroup>{renderTools(markTools)}</ToolGroup>
      <Divider vertical />
      <ToolGroup>{renderTools(blockTools)}</ToolGroup>
      <Divider vertical />
      <InsertGroup
        editor={editor}
        codeActive={state.codeBlock}
        linkActive={state.link}
        onRequestDialog={onRequestDialog}
      />
      <ToolbarSpacer />
      <WordCount aria-label={t('word_count_label')}>
        {t('word_count', { words: state.words ?? 0, chars: state.chars ?? 0 })}
      </WordCount>
    </ToolbarRoot>
  )
}
