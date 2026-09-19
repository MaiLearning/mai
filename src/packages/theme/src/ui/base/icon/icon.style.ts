import styled from 'styled-components'
import type { IconSize } from './icon'

const sizeMap: Record<IconSize, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
}

export const IconRoot = styled.span<{ $size: IconSize }>`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};

  & > svg {
    width: 100%;
    height: 100%;
  }
`
