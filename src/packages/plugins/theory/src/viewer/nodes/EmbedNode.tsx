import { useTranslation } from '@mai/i18n'
import { mergeAttributes, Node } from '@tiptap/core'
import { type NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'
import { Play, Video } from 'lucide-react'
import { useState } from 'react'
import { openExternal } from '../lib/open-external'
import { isValidHttpUrl } from '../lib/url-validation'
import {
  CaptionInput,
  EmbedCaptionRow,
  EmbedFigure,
  EmbedFrame,
  EmbedSetup,
  SetupInput,
} from './EmbedNode.style'

/** View видео-вставки: каркас 16:9 с кнопкой воспроизведения и подписью. */
function EmbedView({ node, updateAttributes }: NodeViewProps) {
  const { t } = useTranslation('theory')
  const url = (node.attrs.url as string | undefined) ?? ''
  const caption = (node.attrs.caption as string | undefined) ?? ''
  const [draftUrl, setDraftUrl] = useState('')
  const [invalid, setInvalid] = useState(false)

  function applyUrl() {
    const value = draftUrl.trim()
    if (!value) return

    if (!isValidHttpUrl(value)) {
      setInvalid(true)

      return
    }

    updateAttributes({ url: value })
    setDraftUrl('')
    setInvalid(false)
  }

  return (
    <EmbedFigure>
      {url ? (
        <EmbedFrame
          type="button"
          aria-label={t('embed_open')}
          title={t('embed_open')}
          onClick={() => void openExternal(url)}
        >
          <Play size={20} fill="currentColor" />
        </EmbedFrame>
      ) : (
        <EmbedSetup>
          <Video size={20} />
          <SetupInput
            value={draftUrl}
            placeholder={t('embed_setup_placeholder')}
            aria-label={t('embed_setup_label')}
            aria-invalid={invalid || undefined}
            data-invalid={invalid || undefined}
            onChange={(e) => {
              setDraftUrl(e.target.value)
              setInvalid(false)
            }}
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
          placeholder={t('embed_caption_placeholder')}
          aria-label={t('embed_caption_label')}
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
