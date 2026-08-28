import { useEffect, useRef, useState } from 'react'
import type { SidebarAction } from '../model/types'
import { MoreIcon, PlusIcon } from './icons'
import {
  ActionButton,
  Bar,
  IconSlot,
  Menu,
  MenuItem,
  MenuWrap,
  MoreButton,
} from './SidebarActions.style'

interface SidebarActionsProps {
  actions: SidebarAction[]
  /** Сколько действий показывать кнопками, остальные уедут в «…». */
  maxVisible?: number
}

/**
 * Панель действий. Первые `maxVisible` действий рендерятся кнопками,
 * все последующие автоматически складываются в overflow-меню,
 * поэтому список действий можно расширять без правки вёрстки.
 */
export function SidebarActions({ actions, maxVisible = 2 }: SidebarActionsProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const visible = actions.slice(0, maxVisible)
  const overflow = actions.slice(maxVisible)

  useEffect(() => {
    if (!openMenu) return
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpenMenu(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenu])

  return (
    <Bar aria-label="Действия с курсом">
      {visible.map((action) => (
        <ActionButton
          key={action.id}
          type="button"
          $variant={action.variant ?? 'primary'}
          disabled={action.disabled}
          onClick={action.onSelect}
        >
          <IconSlot>{action.icon ?? <PlusIcon />}</IconSlot>
          <span>{action.label}</span>
        </ActionButton>
      ))}

      {overflow.length > 0 && (
        <MenuWrap ref={wrapRef}>
          <MoreButton
            type="button"
            aria-haspopup="menu"
            aria-expanded={openMenu}
            aria-label="Ещё действия"
            $open={openMenu}
            onClick={() => setOpenMenu((v) => !v)}
          >
            <MoreIcon />
          </MoreButton>

          {openMenu && (
            <Menu role="menu">
              {overflow.map((action) => (
                <MenuItem
                  key={action.id}
                  role="menuitem"
                  type="button"
                  disabled={action.disabled}
                  onClick={() => {
                    setOpenMenu(false)
                    action.onSelect()
                  }}
                >
                  <IconSlot>{action.icon ?? <PlusIcon />}</IconSlot>
                  <span>{action.label}</span>
                </MenuItem>
              ))}
            </Menu>
          )}
        </MenuWrap>
      )}
    </Bar>
  )
}
