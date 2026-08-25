import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import {
  AlignLeft,
  Bold,
  ChevronDown,
  Code2,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Sigma,
  Strikethrough,
  Table2,
  Underline,
  Undo2,
  Video,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Divider } from '@/app/theme/components/Divider'
import { Tooltip } from '@/app/theme/components/Tooltip'
import {
  BlockMenu,
  BlockMenuItem,
  BlockSelect,
  BlockSelectWrap,
  ToolButton,
  ToolbarRoot,
  ToolbarSpacer,
  ToolGroup,
  WordCount,
} from '../styles/toolbar.style'

/** Типы диалогов вставки, открываемых из тулбара (реализованы в TheoryViewer). */
export type InsertDialogKind = 'link' | 'image' | 'video'

type BlockKind = 'paragraph' | 'h1' | 'h2' | 'h3'

const ALIGN_CYCLE = ['left', 'center', 'right'] as const

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

export interface TheoryToolbarProps {
  editor: Editor | null
  onRequestDialog: (kind: InsertDialogKind) => void
}

/**
 * Панель форматирования: undo/redo, тип блока, начертания, списки/цитата/
 * выравнивание, вставки и счётчик слов. Активные состояния читаются из редактора.
 */
export function TheoryToolbar({ editor, onRequestDialog }: TheoryToolbarProps) {
  const { t } = useTranslation('theory')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuWrapRef = useRef<HTMLDivElement>(null)

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
  const state = rawState ?? DEFAULT_STATE

  // Закрытие меню типов блока по клику вне.
  useEffect(() => {
    if (!menuOpen) return

    function onMouseDown(event: MouseEvent) {
      if (!menuWrapRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)

    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [menuOpen])

  function applyBlock(kind: BlockKind) {
    setMenuOpen(false)
    if (!editor) return

    const chain = editor.chain().focus()
    if (kind === 'paragraph') chain.setParagraph().run()
    else chain.toggleHeading({ level: kind === 'h1' ? 1 : kind === 'h2' ? 2 : 3 }).run()
  }

  function cycleAlign() {
    if (!editor) return
    const index = ALIGN_CYCLE.indexOf(state.align)
    const next = ALIGN_CYCLE[(index + 1) % ALIGN_CYCLE.length]
    const chain = editor.chain().focus()
    if (next === 'left') chain.unsetTextAlign().run()
    else chain.setTextAlign(next).run()
  }

  const blockLabels: Record<BlockKind, string> = {
    paragraph: t('block_paragraph'),
    h1: t('block_h1'),
    h2: t('block_h2'),
    h3: t('block_h3'),
  }

  return (
    <ToolbarRoot role="toolbar" aria-label={t('toolbar_label')}>
      <ToolGroup>
        <Tooltip content={t('undo')}>
          <ToolButton
            type="button"
            label={t('undo')}
            disabled={!state.canUndo}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2 size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('redo')}>
          <ToolButton
            type="button"
            label={t('redo')}
            disabled={!state.canRedo}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2 size={16} />
          </ToolButton>
        </Tooltip>
      </ToolGroup>

      <Divider vertical />

      <BlockSelectWrap ref={menuWrapRef}>
        <BlockSelect
          type="button"
          aria-label={t('block_kind')}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {blockLabels[state.block]} <ChevronDown size={14} />
        </BlockSelect>
        {menuOpen && (
          <BlockMenu>
            {(Object.keys(blockLabels) as BlockKind[]).map((kind) => (
              <BlockMenuItem
                key={kind}
                type="button"
                $active={state.block === kind}
                onClick={() => applyBlock(kind)}
              >
                {blockLabels[kind]}
              </BlockMenuItem>
            ))}
          </BlockMenu>
        )}
      </BlockSelectWrap>

      <Divider vertical />

      <ToolGroup>
        <Tooltip content={t('bold')}>
          <ToolButton
            type="button"
            label={t('bold')}
            $active={state.bold}
            aria-pressed={state.bold}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('italic')}>
          <ToolButton
            type="button"
            label={t('italic')}
            $active={state.italic}
            aria-pressed={state.italic}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('underline')}>
          <ToolButton
            type="button"
            label={t('underline')}
            $active={state.underline}
            aria-pressed={state.underline}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <Underline size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('strike')}>
          <ToolButton
            type="button"
            label={t('strike')}
            $active={state.strike}
            aria-pressed={state.strike}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('highlight')}>
          <ToolButton
            type="button"
            label={t('highlight')}
            $active={state.highlight}
            aria-pressed={state.highlight}
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={16} />
          </ToolButton>
        </Tooltip>
      </ToolGroup>

      <Divider vertical />

      <ToolGroup>
        <Tooltip content={t('bullet_list')}>
          <ToolButton
            type="button"
            label={t('bullet_list')}
            $active={state.bulletList}
            aria-pressed={state.bulletList}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('ordered_list')}>
          <ToolButton
            type="button"
            label={t('ordered_list')}
            $active={state.orderedList}
            aria-pressed={state.orderedList}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('blockquote')}>
          <ToolButton
            type="button"
            label={t('blockquote')}
            $active={state.blockquote}
            aria-pressed={state.blockquote}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('align')}>
          <ToolButton type="button" label={t('align')} onClick={cycleAlign}>
            <AlignLeft size={16} />
          </ToolButton>
        </Tooltip>
      </ToolGroup>

      <Divider vertical />

      <ToolGroup>
        <Tooltip content={t('insert_link')}>
          <ToolButton
            type="button"
            label={t('insert_link')}
            onClick={() => onRequestDialog('link')}
          >
            <Link2 size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('insert_image')}>
          <ToolButton
            type="button"
            label={t('insert_image')}
            onClick={() => onRequestDialog('image')}
          >
            <ImageIcon size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('insert_video')}>
          <ToolButton
            type="button"
            label={t('insert_video')}
            onClick={() => editor?.chain().focus().insertEmbed({}).run()}
          >
            <Video size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('insert_code')}>
          <ToolButton
            type="button"
            label={t('insert_code')}
            $active={state.codeBlock}
            aria-pressed={state.codeBlock}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <Code2 size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('insert_formula')}>
          <ToolButton
            type="button"
            label={t('insert_formula')}
            onClick={() => editor?.chain().focus().insertFormula().run()}
          >
            <Sigma size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('insert_table')}>
          <ToolButton
            type="button"
            label={t('insert_table')}
            onClick={() =>
              editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <Table2 size={16} />
          </ToolButton>
        </Tooltip>
        <Tooltip content={t('insert_divider')}>
          <ToolButton
            type="button"
            label={t('insert_divider')}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={16} />
          </ToolButton>
        </Tooltip>
      </ToolGroup>

      <ToolbarSpacer />
      <WordCount aria-label={t('word_count_label')}>
        {t('word_count', { words: state.words ?? 0, chars: state.chars ?? 0 })}
      </WordCount>
    </ToolbarRoot>
  )
}
