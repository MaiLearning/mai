import styled, { css } from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const inputBase = css<{ $invalid?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.background.body};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14.5px;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast},
    border-radius ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
    opacity: 0.75;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border.strong};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.background.surface};
    border-color: ${({ theme, $invalid }) =>
      $invalid ? theme.status.danger.foreground : theme.border.accent};
    /* Контрастное кольцо box-shadow оптически «выпрямляет» углы: компенсируем,
       слегка увеличивая радиус, чтобы скругление не казалось просевшим. */
    border-radius: calc(${({ theme }) => theme.radius.md} + 2px);
    box-shadow: 0 0 0 3px
      ${({ theme, $invalid }) =>
        $invalid ? theme.status.danger.background : theme.background.accentSubtle};
  }
`

export const NameInput = styled.input<{ $invalid?: boolean }>`
  ${inputBase};
  height: 46px;
  padding: 0 14px;
`

export const DescriptionArea = styled.textarea<{ $invalid?: boolean }>`
  ${inputBase};
  min-height: 104px;
  padding: 12px 14px;
  line-height: 1.55;
  resize: vertical;
`
