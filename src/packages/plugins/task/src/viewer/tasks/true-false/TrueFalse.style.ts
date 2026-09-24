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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};
  cursor: ${({ $editing, $locked }) => ($editing || $locked ? 'default' : 'pointer')};

  svg {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    transition: color ${({ theme }) => theme.durations.fast};
  }

  &:hover {
    border-color: ${({ theme, $editing, $locked }) =>
      $editing || $locked
        ? theme.utils.getBorder('neutral', 'default')
        : theme.utils.getBorder('neutral', 'strong')};
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.utils.getBorder('accent', 'default')};
      background: ${theme.utils.getBackground('accent', 'surface')};
      color: ${theme.utils.getText('accent', 'primary')};
      svg {
        color: ${theme.utils.getText('accent', 'primary')};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.utils.getBorder('success', 'default')};
      background: ${theme.utils.getBackground('success', 'surface')};
      color: ${theme.utils.getText('success', 'primary')};
      svg {
        color: ${theme.utils.getText('success', 'primary')};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.utils.getBorder('danger', 'default')};
      background: ${theme.utils.getBackground('danger', 'surface')};
      color: ${theme.utils.getText('danger', 'primary')};
      svg {
        color: ${theme.utils.getText('danger', 'primary')};
      }
    `}
`

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 0.875rem;
`

export { Block, EditRow, Pair }
