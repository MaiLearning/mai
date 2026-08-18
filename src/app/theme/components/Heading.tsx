import type { ElementType, HTMLAttributes } from 'react'
import styled from 'styled-components'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}
export function Heading({ level = 2, ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType
  return <Root as={Tag as any} $level={level} {...props} />
}
const Root = styled.h2<{ $level: number }>`
  font-family: ${({ theme }) => theme.font.display};
  margin: 0;
  font-size: ${({ theme, $level }) => theme.typography.headings[`h${$level}` as keyof typeof theme.typography.headings].fontSize};
  font-weight: ${({ theme, $level }) => theme.typography.headings[`h${$level}` as keyof typeof theme.typography.headings].fontWeight};
  line-height: ${({ theme, $level }) => theme.typography.headings[`h${$level}` as keyof typeof theme.typography.headings].lineHeight};
  letter-spacing: -0.02em;
`
