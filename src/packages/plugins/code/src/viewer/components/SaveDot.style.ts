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
      ? theme.text.accent
      : $tone === 'success'
        ? theme.status.success.foreground
        : $tone === 'danger'
          ? theme.status.danger.foreground
          : theme.border.strong};
`

export const Label = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.muted};
  white-space: nowrap;
`
