import styled from 'styled-components'
import type { IconSize } from './icon'

const iconSizeMap: Record<IconSize, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
}

export const IconRoot = styled.span<{ $size: string }>`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export { iconSizeMap }
