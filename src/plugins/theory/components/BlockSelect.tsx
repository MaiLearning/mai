import type { Editor } from '@tiptap/core'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import {
  BlockMenu,
  BlockMenuItem,
  BlockSelect as BlockSelectButton,
  BlockSelectWrap,
} from './TheoryToolbar.style'
import type { BlockKind } from './toolbar-state'

interface BlockSelectProps {
  editor: Editor | null
  current: BlockKind
}

/** Селектор типа блока (абзац/заголовки) с выпадающим меню. */
export function BlockSelect({ editor, current }: BlockSelectProps) {
  const { t } = useTranslation('theory')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuWrapRef = useRef<HTMLDivElement>(null)

  // Закрытие меню по клику вне.
  useEffect(() => {
    if (!menuOpen) return

    function onMouseDown(event: MouseEvent) {
      if (!menuWrapRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)

    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [menuOpen])

  const blockLabels: Record<BlockKind, string> = {
    paragraph: t('block_paragraph'),
    h1: t('block_h1'),
    h2: t('block_h2'),
    h3: t('block_h3'),
  }

  function applyBlock(kind: BlockKind) {
    setMenuOpen(false)
    if (!editor) return

    const chain = editor.chain().focus()
    if (kind === 'paragraph') chain.setParagraph().run()
    else chain.toggleHeading({ level: kind === 'h1' ? 1 : kind === 'h2' ? 2 : 3 }).run()
  }

  return (
    <BlockSelectWrap ref={menuWrapRef}>
      <BlockSelectButton
        type="button"
        aria-label={t('block_kind')}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {blockLabels[current]} <ChevronDown size={14} />
      </BlockSelectButton>
      {menuOpen && (
        <BlockMenu>
          {(Object.keys(blockLabels) as BlockKind[]).map((kind) => (
            <BlockMenuItem
              key={kind}
              type="button"
              $active={current === kind}
              onClick={() => applyBlock(kind)}
            >
              {blockLabels[kind]}
            </BlockMenuItem>
          ))}
        </BlockMenu>
      )}
    </BlockSelectWrap>
  )
}
