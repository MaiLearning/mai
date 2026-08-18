import type { ReactNode } from 'react'
import styled from 'styled-components'
export function Tooltip({
  children,
  content,
}: {
  children: ReactNode
  content: string
}) {
  return <Root title={content}>{children}</Root>
}
const Root = styled.span`
  display: inline-flex;
`
