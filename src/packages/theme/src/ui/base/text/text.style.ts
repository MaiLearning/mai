import styled, { css } from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { TextAlign, TextColor, TextLineHeight, TextSize, TextWeight } from './text'

/** Стилевые пропы Text. Префикс `$` — transient, не утекает в DOM. */
export interface TextStyledProps {
  $size?: TextSize
  $weight?: TextWeight
  $color?: TextColor
  $lineHeight?: TextLineHeight
  $align?: TextAlign
  $ellipsis?: boolean
}

function resolveTextColor(theme: AppTheme, color?: TextColor): string {
  switch (color) {
    case undefined:
    case 'primary':
    case 'neutral':
      return theme.utils.getText('neutral', 'primary')
    case 'muted':
    case 'gray':
      return theme.utils.getText('neutral', 'muted')
    case 'accent':
      return theme.utils.getText('accent', 'primary')
    case 'error':
    case 'danger':
      return theme.utils.getText('danger', 'primary')
    case 'success':
      return theme.utils.getText('success', 'primary')
    case 'warning':
      return theme.utils.getText('warning', 'primary')
    case 'info':
      return theme.utils.getText('info', 'primary')
    default:
      return color
  }
}

export const StyledText = styled.span<TextStyledProps>`
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.sizes[p.$size ?? 'md']};
  font-weight: ${(p) => p.theme.typography.weights[p.$weight ?? 'regular']};
  line-height: ${(p) => p.theme.typography.lineHeights[p.$lineHeight ?? 'normal']};
  color: ${(p) => resolveTextColor(p.theme, p.$color)};
  text-align: ${(p) => p.$align ?? 'inherit'};

  ${(p) =>
    p.$ellipsis &&
    css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
    `}
`
