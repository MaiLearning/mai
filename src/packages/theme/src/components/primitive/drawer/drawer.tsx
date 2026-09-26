import { CloseIcon } from '@mai/icons'
import { type ReactNode, useId } from 'react'
import { createPortal } from 'react-dom'
import { useOverlayPanel } from '../overlay/useOverlayPanel'
import {
  CloseButton,
  DrawerBody,
  DrawerFooter,
  type DrawerSide,
  type DrawerSize,
  Header,
  Overlay,
  Panel,
  Title,
} from './drawer.style'

export type { DrawerSide, DrawerSize } from './drawer.style'

export interface DrawerProps {
  /** Открыта ли шторка. */
  opened: boolean
  /** Запрос закрытия (Esc, клик по подложке, кнопка). */
  onClose: () => void
  /** Сторона, откуда выезжает панель. */
  side?: DrawerSide
  /** Размер: ширина (right/left) или высота (bottom). */
  size?: DrawerSize
  /** Заголовок в шапке панели. */
  title?: string
  /** Явный id элемента-подписи вместо автоматического. */
  labelledBy?: string
  /** Разрешить закрытие (Esc, клик по подложке, кнопка). */
  dismissible?: boolean
  /** Футер с действиями. */
  footer?: ReactNode
  /** Содержимое шторки. */
  children: ReactNode
  className?: string
}

/**
 * Drawer — выезжающая панель поверх приложения (right/left/bottom). Общий с
 * `Modal` механизм: портал, блокировка скролла, focus-trap, автофокус и
 * закрытие по Esc. Разметку содержимого собирает потребитель; тело прокручивается.
 *
 * @example
 * <Drawer opened={opened} onClose={close} side="right" size="lg" title="Настройки">
 *   <DrawerBody>…</DrawerBody>
 * </Drawer>
 */
export function Drawer({
  opened,
  onClose,
  side = 'right',
  size = 'md',
  title,
  labelledBy,
  dismissible = true,
  footer,
  children,
  className,
}: DrawerProps) {
  const fallbackId = useId()
  const titleId = useId()
  const { mounted, visible, closing, panelRef, onKeyDown } = useOverlayPanel({
    opened,
    onClose,
    dismissible,
  })

  if (!mounted || !visible) return null

  const labelledById = title ? titleId : (labelledBy ?? fallbackId)

  return createPortal(
    <Overlay
      $side={side}
      $closing={closing}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissible) onClose()
      }}
    >
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        tabIndex={-1}
        $side={side}
        $size={size}
        $closing={closing}
        className={className}
        onKeyDown={onKeyDown}
      >
        {(title || dismissible) && (
          <Header>
            {title ? <Title id={titleId}>{title}</Title> : <span />}
            {dismissible && (
              <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
                <CloseIcon aria-hidden="true" />
              </CloseButton>
            )}
          </Header>
        )}
        <DrawerBody>{children}</DrawerBody>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </Panel>
    </Overlay>,
    document.body,
  )
}

export { DrawerBody, DrawerFooter, DrawerFooterSpacer } from './drawer.style'
