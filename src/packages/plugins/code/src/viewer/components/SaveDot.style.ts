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
      ? theme.utils.getSolid('accent', 'base')
      : $tone === 'success'
        ? theme.utils.getSolid('success', 'base')
        : $tone === 'danger'
          ? theme.utils.getSolid('danger', 'base')
          : theme.utils.getBorder('neutral', 'strong')};
`

export const Label = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  white-space: nowrap;
`
