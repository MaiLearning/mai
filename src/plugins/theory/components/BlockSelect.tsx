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

const BLOCK_KINDS: BlockKind[] = ['paragraph', 'h1', 'h2', 'h3']

/** Селектор типа блока (абзац/заголовки): мышь + клавиатура (стрелки, Enter, Escape). */
export function BlockSelect({ editor, current }: BlockSelectProps) {
  const { t } = useTranslation('theory')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
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

  function openMenu() {
    setCursor(Math.max(0, BLOCK_KINDS.indexOf(current)))
    setMenuOpen(true)
  }

  function applyBlock(kind: BlockKind) {
    setMenuOpen(false)
    if (!editor) return

    const chain = editor.chain().focus()
    if (kind === 'paragraph') chain.setParagraph().run()
    else chain.toggleHeading({ level: kind === 'h1' ? 1 : kind === 'h2' ? 2 : 3 }).run()
  }

  function onButtonKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!menuOpen) openMenu()

      return
    }
    if (event.key === 'Escape') setMenuOpen(false)
  }

  function onMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((index) => Math.min(index + 1, BLOCK_KINDS.length - 1))

      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((index) => Math.max(index - 1, 0))

      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      applyBlock(BLOCK_KINDS[cursor])

      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setMenuOpen(false)
    }
  }

  return (
    <BlockSelectWrap ref={menuWrapRef}>
      <BlockSelectButton
        type="button"
        aria-label={t('block_kind')}
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
      >
        {blockLabels[current]} <ChevronDown size={14} />
      </BlockSelectButton>
      {menuOpen && (
        <BlockMenu role="listbox" onKeyDown={onMenuKeyDown}>
          {BLOCK_KINDS.map((kind) => (
            <BlockMenuItem
              key={kind}
              type="button"
              role="option"
              aria-selected={current === kind}
              $active={current === kind}
              data-cursor={cursor === BLOCK_KINDS.indexOf(kind) || undefined}
              onMouseEnter={() => setCursor(BLOCK_KINDS.indexOf(kind))}
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
