import { mergeAttributes, Node } from '@tiptap/core'
import { NodeViewContent, type NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'
import { CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'
import { CalloutBox, ToneSwitch, ToneSwitchDot } from './views.style'

/** Тон выноски: подсказка, акцент/идея, успех/важно. */
export type CalloutTone = 'info' | 'accent' | 'success'

const TONES: CalloutTone[] = ['info', 'accent', 'success']

function toneIcon(tone: CalloutTone) {
  if (tone === 'success') return CheckCircle2
  if (tone === 'accent') return Sparkles

  return Lightbulb
}

/** View выноски: иконка по тону + редактируемое содержимое. */
function CalloutView({ node, selected, updateAttributes }: NodeViewProps) {
  const tone = (node.attrs.tone as CalloutTone | undefined) ?? 'info'
  const Icon = toneIcon(tone)

  return (
    <CalloutBox $tone={tone} data-selected={selected || undefined}>
      <Icon size={18} />
      <NodeViewContent className="th-callout-content" />
      {selected && (
        <ToneSwitch role="group" aria-label="Тон выноски">
          {TONES.map((t) => (
            <ToneSwitchDot
              key={t}
              type="button"
              $tone={t}
              $active={t === tone}
              aria-label={`Тон: ${t}`}
              aria-pressed={t === tone}
              onClick={() => updateAttributes({ tone: t })}
            />
          ))}
        </ToneSwitch>
      )}
    </CalloutBox>
  )
}

/**
 * CalloutNode — заметка-выноска с иконкой и цветным фоном.
 *
 * Содержимое — любые блочные узлы (абзацы, списки). Тон переключается
 * мини-переключателем при выделении узла.
 */
export const CalloutNode = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      tone: {
        default: 'info',
        parseHTML: (element) => {
          const value = element.getAttribute('data-tone')

          return TONES.includes(value as CalloutTone) ? value : 'info'
        },
        renderHTML: (attributes) => ({ 'data-tone': attributes.tone }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'aside[data-callout]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'aside',
      mergeAttributes(HTMLAttributes, { 'data-callout': '', class: 'th-callout' }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },

  addCommands() {
    return {
      insertCallout:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { tone: attrs?.tone ?? 'info' },
            content: [{ type: 'paragraph' }],
          }),
    }
  },
})
