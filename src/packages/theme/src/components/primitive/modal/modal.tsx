import { type ReactNode, useId } from 'react'
import { createPortal } from 'react-dom'
import { useOverlayPanel } from '../overlay/useOverlayPanel'
import {
  CloseButton,
  Grabber,
  Header,
  ModalBody,
  ModalFooter,
  Overlay,
  Panel,
  Title,
} from './modal.style'

export interface ModalProps {
  opened: boolean
  onClose: () => void
  title?: string
  labelledBy?: string
  dismissible?: boolean
  width?: number
  footer?: ReactNode
  children: ReactNode
}

export function Modal({
  opened,
  onClose,
  title,
  labelledBy,
  dismissible = true,
  width = 620,
  footer,
  children,
}: ModalProps) {
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
      $closing={closing}
      $width={width}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dismissible) onClose()
      }}
    >
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        tabIndex={-1}
        $closing={closing}
        $width={width}
        onKeyDown={onKeyDown}
      >
        <Grabber aria-hidden="true" />
        {title ? (
          <>
            <Header>
              <Title id={titleId}>{title}</Title>
              {dismissible && (
                <CloseButton aria-label="Закрыть" onClick={onClose}>
                  ×
                </CloseButton>
              )}
            </Header>
            <ModalBody>{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        ) : (
          children
        )}
      </Panel>
    </Overlay>,
    document.body,
  )
}

export { ModalBody, ModalFooter, ModalFooterSpacer } from './modal.style'
