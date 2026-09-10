import styled from 'styled-components'

export const IndicatorRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

export const Dot = styled.span<{ $tone: 'muted' | 'primary' | 'success' | 'danger' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme, $tone }) =>
    $tone === 'primary'
      ? theme.colors.primary
      : $tone === 'success'
        ? theme.colors.success
        : $tone === 'danger'
          ? theme.colors.danger
          : theme.colors.borderStrong};
`

export const Label = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`
