import styled, { css } from 'styled-components'

const TextArea = styled.textarea<{ $state?: 'idle' | 'correct' | 'incorrect' }>`
  width: 100%;
  min-height: 150px;
  resize: vertical;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 1rem;
  line-height: 1.6;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySurface};
  }

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.colors.success};
    `}
`

const SampleCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceElevated};

  svg {
    color: ${({ theme }) => theme.colors.accent};
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
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .text {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }
`

/** Строка правки подсказки поля ввода в режиме редактирования. */
const EditRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`

export { EditRow, SampleBody, SampleCard, TextArea }
