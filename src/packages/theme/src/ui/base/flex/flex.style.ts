import styled from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { FlexAlign, FlexDirection, FlexJustify, FlexWrap } from './flex'

export interface FlexRootProps {
  $direction: FlexDirection
  $align?: FlexAlign
  $justify?: FlexJustify
  $wrap: FlexWrap
  $gap?: keyof AppTheme['spacing'] | number
}

export const FlexRoot = styled.div<FlexRootProps>`
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $align }) => $align ?? 'stretch'};
  justify-content: ${({ $justify }) => $justify ?? 'flex-start'};
  flex-wrap: ${({ $wrap }) => $wrap};
  gap: ${({ theme, $gap }) => ($gap === undefined ? '0' : typeof $gap === 'number' ? `${$gap}px` : theme.spacing[$gap])};
`
