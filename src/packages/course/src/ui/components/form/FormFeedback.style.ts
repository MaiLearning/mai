import styled from 'styled-components'

/** Строка ошибки формы (рендерится внизу тела модалки). */
export const FormError = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.status.danger.background};
  background: ${({ theme }) => theme.status.danger.background};
  color: ${({ theme }) => theme.status.danger.foreground};
  font-size: 13px;
  font-weight: 500;
`

export const BadgeRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.muted};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.status.warning.foreground};
  }
`
