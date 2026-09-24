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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme, $variant }) =>
    $variant === 'term'
      ? theme.utils.getBackground('neutral', 'elevated')
      : theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  min-height: 52px;

  ${({ $variant, theme }) =>
    $variant === 'def' &&
    css`
      cursor: grab;
      &:hover {
        border-color: ${theme.utils.getBorder('neutral', 'strong')};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.utils.getBorder('success', 'default')};
      background: ${theme.utils.getBackground('success', 'surface')};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.utils.getBorder('danger', 'default')};
      background: ${theme.utils.getBackground('danger', 'surface')};
    `}

  svg.grip {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    flex-shrink: 0;
  }
`

const Connector = styled.span`
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 1.1rem;
  user-select: none;
`

const Spacer = styled.span`
  width: 30px;
`

export { Cell, Connector, Row, Rows, Spacer }
