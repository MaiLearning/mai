import { error as logError } from '@tauri-apps/plugin-log'
import { openUrl } from '@tauri-apps/plugin-opener'
import { mergeAttributes, Node } from '@tiptap/core'
import { type NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'
import { Play, Video } from 'lucide-react'
import { useState } from 'react'
import {
  CaptionInput,
  EmbedCaptionRow,
  EmbedFigure,
  EmbedFrame,
  EmbedSetup,
  SetupInput,
} from './EmbedNode.style'

/**
 * Открывает ссылку на видео во внешнем браузере через opener-плагин Tauri.
 * При недоступности API или запрете permissions — ошибка пишется в лог.
 */
async function openExternal(url: string): Promise<void> {
  try {
    await openUrl(url)
  } catch (e) {
    logError(`plugins/theory: open embed url failed: ${e instanceof Error ? e.message : String(e)}`)
  }
}

/** View видео-вставки: каркас 16:9 с кнопкой воспроизведения и подписью. */
function EmbedView({ node, updateAttributes }: NodeViewProps) {
  const url = (node.attrs.url as string | undefined) ?? ''
  const caption = (node.attrs.caption as string | undefined) ?? ''
  const [draftUrl, setDraftUrl] = useState('')

  function applyUrl() {
    const value = draftUrl.trim()
    if (!value) return

    updateAttributes({ url: value })
    setDraftUrl('')
  }

  return (
    <EmbedFigure>
      {url ? (
        <EmbedFrame type="button" aria-label="Открыть видео" onClick={() => void openExternal(url)}>
          <Play size={20} fill="currentColor" />
        </EmbedFrame>
      ) : (
        <EmbedSetup>
          <Video size={20} />
          <SetupInput
            value={draftUrl}
            placeholder="Вставьте ссылку на видео и нажмите Enter"
            aria-label="Ссылка на видео"
            onChange={(e) => setDraftUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyUrl()
              }
            }}
            onBlur={applyUrl}
          />
        </EmbedSetup>
      )}
      <EmbedCaptionRow>
        <CaptionInput
          value={caption}
          placeholder="Подпись к видео"
          aria-label="Подпись к видео"
          onChange={(e) => updateAttributes({ caption: e.target.value })}
        />
      </EmbedCaptionRow>
    </EmbedFigure>
  )
}

/**
 * EmbedNode — блочная вставка видео по ссылке.
 *
 * Хранит URL и подпись. Само видео не встраивается iframe-ом (без сетевых
 * запросов из редактора) — клик по каркасу открывает ссылку во внешнем браузере.
 */
export const EmbedNode = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: '' },
      caption: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'figure[data-embed]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(HTMLAttributes, {
        'data-embed': '',
        class: 'th-embed',
        'data-url': HTMLAttributes.url ?? '',
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedView)
  },

  addCommands() {
    return {
      insertEmbed:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { url: attrs?.url ?? '', caption: attrs?.caption ?? '' },
          }),
    }
  },
})
