import type { Editor } from '@tiptap/core'
import { Code2, Image as ImageIcon, Link2, Minus, Sigma, Table2, Video } from 'lucide-react'
import { useTranslation } from '@/app/i18n'
import { Tooltip } from '@/app/theme/components/Tooltip'
import type { InsertDialogKind } from './TheoryToolbar'
import { ToolButton, ToolGroup } from './TheoryToolbar.style'

interface InsertGroupProps {
  editor: Editor | null
  /** Активность кнопки кода (курсор внутри код-блока). */
  codeActive: boolean
  onRequestDialog: (kind: InsertDialogKind) => void
}

/** Группа вставок: ссылки, медиа, код, формула, таблица, разделитель. */
export function InsertGroup({ editor, codeActive, onRequestDialog }: InsertGroupProps) {
  const { t } = useTranslation('theory')

  const tools = [
    {
      icon: Link2,
      label: t('insert_link'),
      active: false,
      onClick: () => onRequestDialog('link'),
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
            onClick={tool.onClick}
          >
            <tool.icon size={16} />
          </ToolButton>
        </Tooltip>
      ))}
    </ToolGroup>
  )
}
