import styled, { css } from 'styled-components'

const Paragraph = styled.div`
  font-size: 1.0625rem;
  line-height: 2.1;
  color: ${({ theme }) => theme.colors.text};
`

const Blank = styled.input<{ $state?: 'idle' | 'correct' | 'incorrect' }>`
  display: inline-block;
  min-width: 120px;
  width: 120px;
  margin: 0 4px;
  padding: 4px 10px;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm} ${({ theme }) => theme.radii.sm} 0 0;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 1rem;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-bottom-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
      color: ${theme.colors.success};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-bottom-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
      color: ${theme.colors.danger};
    `}
`

/** Токен пропуска в режиме редактирования — показывает эталонный ответ. */
const BlankToken = styled.span`
  display: inline-flex;
  align-items: center;
  margin: 0 4px;
  padding: 2px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9375rem;
  font-weight: 600;
`

export { Blank, BlankToken, Paragraph }
