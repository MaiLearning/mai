import styled from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { StackAlign, StackDirection } from './stack'

export interface StackRootProps {
  $direction: StackDirection
  $gap?: keyof AppTheme['spacing'] | number
  $align?: StackAlign
}

export const StackRoot = styled.div<StackRootProps>`
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  flex-direction: ${({ $direction }) => ($direction === 'vertical' ? 'column' : 'row')};
  align-items: ${({ $align }) => $align ?? 'stretch'};
  gap: ${({ theme, $gap }) =>
    $gap === undefined ? '0' : typeof $gap === 'number' ? `${$gap}px` : theme.spacing[$gap]};
`
