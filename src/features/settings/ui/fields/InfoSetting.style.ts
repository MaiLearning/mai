import styled from 'styled-components'

export const Value = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
