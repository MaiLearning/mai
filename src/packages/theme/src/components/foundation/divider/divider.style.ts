import styled from 'styled-components'

export const DividerRoot = styled.div<{ $vertical: boolean }>`
  flex: none;
  background: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  ${({ $vertical }) =>
    $vertical ? 'width: 1px; align-self: stretch;' : 'height: 1px; width: 100%;'}
`
