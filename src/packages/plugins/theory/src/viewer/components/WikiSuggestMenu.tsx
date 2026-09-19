import { useTranslation } from '@mai/i18n'
import { FileText } from 'lucide-react'
import type { WikiResourceItem } from '../lib/course-resources'
import { MenuEmpty, MenuItem, MenuSurface } from './WikiSuggestMenu.style'

interface WikiSuggestMenuProps {
  items: WikiResourceItem[]
  selected: number
  rect: { top: number; left: number } | null
  onPick: (item: WikiResourceItem) => void
}

/**
 * Всплывающее меню wiki-автокомплита: список материалов курса под курсором.
 * onMouseDown с preventDefault — чтобы редактор не терял фокус до вставки.
 */
export function WikiSuggestMenu({ items, selected, rect, onPick }: WikiSuggestMenuProps) {
  const { t } = useTranslation('theory')

  if (items.length === 0) {
    return (
      <MenuSurface $x={rect?.left ?? 0} $y={rect?.top ?? 0}>
        <MenuEmpty>{t('wiki_suggest_empty')}</MenuEmpty>
      </MenuSurface>
    )
  }

  return (
    <MenuSurface $x={rect?.left ?? 0} $y={rect?.top ?? 0} role="listbox">
      {items.map((item, index) => (
        <MenuItem
          key={item.resourceId}
          type="button"
          data-active={index === selected || undefined}
          role="option"
          aria-selected={index === selected}
          onMouseDown={(e) => {
            e.preventDefault()
            onPick(item)
          }}
        >
          <FileText size={13} />
          {item.name}
        </MenuItem>
      ))}
    </MenuSurface>
  )
}
