import { useTranslation } from '@mai/i18n'
import type { Editor } from '@tiptap/core'
import {
  Code2,
  Image as ImageIcon,
  Link2,
  Link2Off,
  Minus,
  Sigma,
  Table2,
  Video,
} from 'lucide-react'
import { Tooltip } from '../../ui'
import type { InsertDialogKind } from './TheoryToolbar'
import { ToolButton, ToolGroup } from './TheoryToolbar.style'

interface InsertGroupProps {
  editor: Editor | null
  /** Активность кнопки кода (курсор внутри код-блока). */
  codeActive: boolean
  /** Активность кнопки ссылки (курсор внутри link-марки). */
  linkActive: boolean
  onRequestDialog: (kind: InsertDialogKind) => void
}

/** Группа вставок: ссылки, медиа, код, формула, таблица, разделитель. */
export function InsertGroup({ editor, codeActive, linkActive, onRequestDialog }: InsertGroupProps) {
  const { t } = useTranslation('theory')

  const tools = [
    {
      icon: Link2,
      label: t('insert_link'),
      active: linkActive,
      onClick: () => onRequestDialog('link'),
    },
    {
      icon: Link2Off,
      label: t('insert_unlink'),
      active: false,
      disabled: !linkActive,
      onClick: () => editor?.chain().focus().extendMarkRange('link').unsetLink().run(),
    },
    {
      icon: ImageIcon,
      label: t('insert_image'),
      active: false,
      onClick: () => onRequestDialog('image'),
    },
    {
      icon: Video,
      label: t('insert_video'),
      active: false,
      onClick: () => editor?.chain().focus().insertEmbed({}).run(),
    },
    {
      icon: Code2,
      label: t('insert_code'),
      active: codeActive,
      onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: Sigma,
      label: t('insert_formula'),
      active: false,
      onClick: () => editor?.chain().focus().insertFormula().run(),
    },
    {
      icon: Table2,
      label: t('insert_table'),
      active: false,
      onClick: () =>
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      icon: Minus,
      label: t('insert_divider'),
      active: false,
      onClick: () => editor?.chain().focus().setHorizontalRule().run(),
    },
  ]

  return (
    <ToolGroup>
      {tools.map((tool) => (
        <Tooltip key={tool.label} content={tool.label}>
          <ToolButton
            type="button"
            label={tool.label}
            $active={tool.active}
            aria-pressed={tool.active}
            disabled={tool.disabled}
            onClick={tool.onClick}
          >
            <tool.icon size={16} />
          </ToolButton>
        </Tooltip>
      ))}
    </ToolGroup>
  )
}
