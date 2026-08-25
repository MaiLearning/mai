import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
export function ScrollArea({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <Root data-lenis-prevent="true" {...props}>
      {children}
    </Root>
  )
}
const Root = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: auto;
  scrollbar-width: thin;
`
