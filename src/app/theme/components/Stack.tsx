import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  gap?: string
}
export function Stack({ gap = 'md', ...props }: StackProps) {
  return <Root $gap={gap} {...props} />
}
const Root = styled.div<{ $gap: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $gap }) => theme.spacing[$gap as keyof typeof theme.spacing] ?? $gap};
`
