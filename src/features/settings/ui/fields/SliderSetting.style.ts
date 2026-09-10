import styled from 'styled-components'

export const Value = styled.span`
  min-width: 48px;
  text-align: right;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.text};
`

export const Range = styled.input`
  width: 180px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
