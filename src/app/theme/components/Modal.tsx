import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

interface ModalProps {
  opened: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ opened, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!opened) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [opened, onClose])

  if (!opened) return null

  return createPortal(
    <Overlay onMouseDown={onClose}>
      <Content
        role="dialog"
        aria-modal="true"
        aria-labelledby="mai-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id="mai-modal-title">{title}</Title>
          <Close type="button" aria-label="Закрыть" onClick={onClose}>
            ×
          </Close>
        </Header>
        {children}
      </Content>
    </Overlay>,
    document.body,
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.48);
`
const Content = styled.div`
  width: min(100%, 520px);
  max-height: calc(100dvh - 48px);
  overflow: auto;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`
const Title = styled.h2`
  font-size: 1.25rem;
  line-height: 1.3;
`
const Close = styled.button`
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`
