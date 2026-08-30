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
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $editing, $locked }) => ($editing || $locked ? 'default' : 'pointer')};

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    border-color: ${({ theme, $editing, $locked }) =>
      $editing || $locked ? theme.colors.border : theme.colors.borderStrong};
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primarySurface};
      color: ${theme.colors.primary};
      svg {
        color: ${theme.colors.primary};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
      color: ${theme.colors.success};
      svg {
        color: ${theme.colors.success};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
      color: ${theme.colors.danger};
      svg {
        color: ${theme.colors.danger};
      }
    `}
`

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`

export { Block, EditRow, Pair }
