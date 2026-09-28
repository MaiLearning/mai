import styled from 'styled-components'
import type { SpacingValue } from '../../../base/utils'
import type { StackAlign, StackDirection } from './stack'

export interface StackRootProps {
  $direction: StackDirection
  $gap?: SpacingValue
  $align?: StackAlign
}

export const StackRoot = styled.div<StackRootProps>`
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  flex-direction: ${({ $direction }) => ($direction === 'vertical' ? 'column' : 'row')};
  align-items: ${({ $align }) => $align ?? 'stretch'};
  ${({ theme, $gap }) => $gap !== undefined && `gap: ${theme.utils.space($gap)};`}
`
