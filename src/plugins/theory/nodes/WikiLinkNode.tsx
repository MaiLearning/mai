import { mergeAttributes, Node } from '@tiptap/core'
import { type NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import type { KeyboardEvent } from 'react'
import { useTranslation } from '@/app/i18n'
import { navigateWikiResource } from '../lib/wiki-navigation'
import { useWikiStatus } from '../lib/wiki-status'
import { WikiChip, WikiChipIcon } from './WikiLinkNode.style'

/** View wiki-ссылки: чип с иконкой материала; broken-цель подсвечивается. */
function WikiLinkView({ node }: NodeViewProps) {
  const { t } = useTranslation('theory')
  const resourceId = (node.attrs.resourceId as string | undefined) ?? ''
  const label = (node.attrs.label as string | undefined) ?? ''
  const broken = useWikiStatus(resourceId) === 'broken'

  function open() {
    if (resourceId) navigateWikiResource(resourceId)
  }

  return (
    <NodeViewWrapper as="span">
      <WikiChip
        $broken={broken}
        role="link"
        tabIndex={0}
        data-broken={broken || undefined}
        aria-label={t('wiki_link_open', { name: label })}
        onClick={open}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            open()
          }
        }}
      >
        <WikiChipIcon size={12} />
        {label || resourceId}
      </WikiChip>
    </NodeViewWrapper>
  )
}

/**
 * WikiLinkNode — инлайн-ссылка на другой материал курса (в духе Obsidian).
 *
 * Вставляется через автокомплит `[[`; упоминание порождает ребро Link
 * (resource → resource) — синхронизацию выполняет lib/wiki-links после автосейва.
 */
export const WikiLinkNode = Node.create({
  name: 'wikiLink',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      resourceId: { default: '' },
      label: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'a[data-wiki]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        'data-wiki': '',
        'data-resource-id': node.attrs.resourceId ?? '',
      }),
      node.attrs.label ?? '',
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(WikiLinkView)
  },

  addCommands() {
    return {
      insertWikiLink:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { resourceId: attrs?.resourceId ?? '', label: attrs?.label ?? '' },
          }),
    }
  },
})
