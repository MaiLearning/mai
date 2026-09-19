import styled from 'styled-components'

export const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

export const LabelText = styled.label`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.text.primary};

  span {
    color: ${({ theme }) => theme.text.accent};
    margin-left: 3px;
  }
`

export const Counter = styled.span<{ $over?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $over }) => ($over ? theme.status.danger.foreground : theme.text.muted)};
`

export const Hint = styled.p`
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text.muted};
`

export const ErrorText = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.status.danger.foreground};
`
