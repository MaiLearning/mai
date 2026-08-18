import type { HTMLAttributes } from 'react'
import styled from 'styled-components'

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  return <Root {...props} />
}
const Root = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`
