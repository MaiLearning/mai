import styled, { keyframes } from 'styled-components'
export function Spinner({ label = 'Загрузка' }: { label?: string }) {
  return <Root role="status" aria-label={label} />
}
const spin = keyframes`to { transform: rotate(360deg); }`

const Root = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`
