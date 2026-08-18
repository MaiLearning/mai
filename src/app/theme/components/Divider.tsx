import styled from 'styled-components'
export function Divider({ vertical = false }: { vertical?: boolean }) {
  return (
    <Root
      $vertical={vertical}
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
    />
  )
}
const Root = styled.div<{ $vertical: boolean }>`
  flex: none;
  background: ${({ theme }) => theme.colors.border};
  ${({ $vertical }) => ($vertical ? 'width: 1px; align-self: stretch;' : 'height: 1px; width: 100%;')}
`
