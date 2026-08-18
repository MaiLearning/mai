import type { HTMLAttributes } from 'react'
import styled from 'styled-components'
export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  muted?: boolean
}
export function Text({ muted, ...props }: TextProps) {
  return <Root $muted={muted} {...props} />
}
const Root = styled.span<{ $muted?: boolean }>`
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textMuted : theme.colors.text)};
`
