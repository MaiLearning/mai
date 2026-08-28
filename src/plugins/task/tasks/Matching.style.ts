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
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $variant }) =>
    $variant === 'term' ? theme.colors.surfaceElevated : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  min-height: 52px;

  ${({ $variant, theme }) =>
    $variant === 'def' &&
    css`
      cursor: grab;
      &:hover {
        border-color: ${theme.colors.borderStrong};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
    `}

  svg.grip {
    color: ${({ theme }) => theme.colors.textMuted};
    flex-shrink: 0;
  }
`

const Connector = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.1rem;
  user-select: none;
`

const Spacer = styled.span`
  width: 30px;
`

export { Cell, Connector, Row, Rows, Spacer }
