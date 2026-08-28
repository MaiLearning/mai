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
import { useTranslation } from '@/app/i18n'
import { Divider } from '@/app/theme/components/Divider'
import { Tooltip } from '@/app/theme/components/Tooltip'
import { BlockSelect } from './BlockSelect'
import { InsertGroup } from './InsertGroup'
import { ToolButton, ToolbarRoot, ToolbarSpacer, ToolGroup, WordCount } from './TheoryToolbar.style'
import { ALIGN_CYCLE, useToolbarState } from './toolbar-state'

/** Типы диалогов вставки, открываемых из тулбара (реализованы в TheoryViewer). */
export type InsertDialogKind = 'link' | 'image' | 'video'

export interface TheoryToolbarProps {
  editor: Editor | null
  onRequestDialog: (kind: InsertDialogKind) => void
}

interface ToolItem {
  icon: LucideIcon
  label: string
  active: boolean
  disabled?: boolean
  onClick: () => void
}

/** Фабрика элементов тулбара — держит конфиги кнопок однострочными. */
function tool(
  icon: LucideIcon,
  label: string,
  active: boolean,
  onClick: () => void,
  disabled?: boolean,
): ToolItem {
  return { icon, label, active, disabled, onClick }
}

/**
 * Панель форматирования: undo/redo, тип блока, начертания, списки/цитата/
 * выравнивание, вставки и счётчик слов. Активные состояния читаются из редактора.
 */
export function TheoryToolbar({ editor, onRequestDialog }: TheoryToolbarProps) {
  const { t } = useTranslation('theory')
  const state = useToolbarState(editor)
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
    tool(Undo2, t('undo'), false, () => focus()?.undo().run(), !state.canUndo),
    tool(Redo2, t('redo'), false, () => focus()?.redo().run(), !state.canRedo),
  ]

  const markTools = [
    tool(Bold, t('bold'), state.bold, () => focus()?.toggleBold().run()),
    tool(Italic, t('italic'), state.italic, () => focus()?.toggleItalic().run()),
    tool(Underline, t('underline'), state.underline, () => focus()?.toggleUnderline().run()),
    tool(Strikethrough, t('strike'), state.strike, () => focus()?.toggleStrike().run()),
    tool(Highlighter, t('highlight'), state.highlight, () => focus()?.toggleHighlight().run()),
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
      <Tooltip key={item.label} content={item.label}>
        <ToolButton
          type="button"
          label={item.label}
          $active={item.active}
          aria-pressed={item.active}
          disabled={item.disabled}
          onClick={item.onClick}
        >
          <item.icon size={16} />
        </ToolButton>
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
      <InsertGroup editor={editor} codeActive={state.codeBlock} onRequestDialog={onRequestDialog} />
      <ToolbarSpacer />
      <WordCount aria-label={t('word_count_label')}>
        {t('word_count', { words: state.words ?? 0, chars: state.chars ?? 0 })}
      </WordCount>
    </ToolbarRoot>
  )
}
