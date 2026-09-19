import styled, { css } from 'styled-components'

const TextArea = styled.textarea<{
  $state?: 'idle' | 'correct' | 'incorrect'
  $locked?: boolean
}>`
  width: 100%;
  min-height: 150px;
  resize: vertical;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font: inherit;
  font-size: 1rem;
  line-height: 1.6;
  transition: all ${({ theme }) => theme.durations.fast};
  cursor: ${({ $locked }) => ($locked ? 'default' : 'text')};

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
  }

  &:focus {
    outline: none;
  }

  /* Активное поле — акцентная рамка; у зафиксированного ввода акцентов нет. */
  ${({ $locked, theme }) =>
    !$locked &&
    css`
      &:focus {
        border-color: ${theme.border.accent};
        box-shadow: 0 0 0 3px ${theme.background.accentSubtle};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.status.success.foreground};
    `}
`

const SampleCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.elevated};

  svg {
    color: ${({ theme }) => theme.text.accent};
    flex-shrink: 0;
    margin-top: 2px;
  }
`

const SampleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text.muted};
  }

  .text {
    color: ${({ theme }) => theme.text.primary};
    line-height: 1.6;
  }
`

/** Строка правки подсказки поля ввода в режиме редактирования. */
const EditRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.border.strong};
  }
`

export { EditRow, SampleBody, SampleCard, TextArea }
