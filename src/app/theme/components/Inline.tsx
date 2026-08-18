import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  gap?: string
  justify?: string
}
export function Inline({ gap = 'md', justify = 'flex-start', ...props }: InlineProps) {
  return <Root $gap={gap} $justify={justify} {...props} />
}
const Root = styled.div<{ $gap: string; $justify: string }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $justify }) => $justify};
  gap: ${({ theme, $gap }) => theme.spacing[$gap as keyof typeof theme.spacing] ?? $gap};
`
