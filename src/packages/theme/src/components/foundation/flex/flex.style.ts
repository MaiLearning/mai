import styled from 'styled-components'
import type { SpacingValue } from '../../../base/utils'
import type { FlexAlign, FlexDirection, FlexJustify, FlexWrap } from './flex'

export interface FlexRootProps {
  $direction: FlexDirection
  $align?: FlexAlign
  $justify?: FlexJustify
  $wrap: FlexWrap
  $gap?: SpacingValue
}

export const FlexRoot = styled.div<FlexRootProps>`
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $align }) => $align ?? 'stretch'};
  justify-content: ${({ $justify }) => $justify ?? 'flex-start'};
  flex-wrap: ${({ $wrap }) => $wrap};
  ${({ theme, $gap }) => $gap !== undefined && `gap: ${theme.utils.space($gap)};`}
`
