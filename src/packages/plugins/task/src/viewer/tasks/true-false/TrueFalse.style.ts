import styled, { css } from 'styled-components'

const Pair = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`

const Block = styled.button<{
  $selected?: boolean
  $state?: 'idle' | 'correct' | 'incorrect'
  $editing?: boolean
  $locked?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 36px 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};
  cursor: ${({ $editing, $locked }) => ($editing || $locked ? 'default' : 'pointer')};

  svg {
    color: ${({ theme }) => theme.text.muted};
    transition: color ${({ theme }) => theme.durations.fast};
  }

  &:hover {
    border-color: ${({ theme, $editing, $locked }) =>
      $editing || $locked ? theme.border.default : theme.border.strong};
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.border.accent};
      background: ${theme.background.accentSubtle};
      color: ${theme.text.accent};
      svg {
        color: ${theme.text.accent};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.status.success.foreground};
      background: ${theme.status.success.background};
      color: ${theme.status.success.foreground};
      svg {
        color: ${theme.status.success.foreground};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.status.danger.foreground};
      background: ${theme.status.danger.background};
      color: ${theme.status.danger.foreground};
      svg {
        color: ${theme.status.danger.foreground};
      }
    `}
`

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.875rem;
`

export { Block, EditRow, Pair }
