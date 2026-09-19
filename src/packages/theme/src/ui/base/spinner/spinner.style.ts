import styled, { keyframes } from 'styled-components'
import type { SpinnerSpeed } from './spinner'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const speedMap: Record<SpinnerSpeed, string> = {
  slow: '1.2s',
  normal: '0.8s',
  fast: '0.5s',
}

export interface SpinnerStyledProps {
  $speed: SpinnerSpeed
}

export const SpinnerRoot = styled.span<SpinnerStyledProps>`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid ${({ theme }) => theme.text.accent};
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} ${({ $speed }) => speedMap[$speed]} linear infinite;
`
