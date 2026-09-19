import styled, { css } from 'styled-components'

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  align-items: center;
  gap: 12px;
`

const Cell = styled.div<{ $variant: 'term' | 'def'; $state?: 'idle' | 'correct' | 'incorrect' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme, $variant }) =>
    $variant === 'term' ? theme.background.elevated : theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  min-height: 52px;

  ${({ $variant, theme }) =>
    $variant === 'def' &&
    css`
      cursor: grab;
      &:hover {
        border-color: ${theme.border.strong};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.status.success.foreground};
      background: ${theme.status.success.background};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.status.danger.foreground};
      background: ${theme.status.danger.background};
    `}

  svg.grip {
    color: ${({ theme }) => theme.text.muted};
    flex-shrink: 0;
  }
`

const Connector = styled.span`
  color: ${({ theme }) => theme.text.muted};
  font-size: 1.1rem;
  user-select: none;
`

const Spacer = styled.span`
  width: 30px;
`

export { Cell, Connector, Row, Rows, Spacer }
