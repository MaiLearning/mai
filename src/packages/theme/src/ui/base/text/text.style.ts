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

function isTextColorToken(
  theme: AppTheme,
  color: TextColor,
): color is keyof AppTheme['text'] | keyof AppTheme['status'] {
  return color in theme.text || color in theme.status
}

function resolveTextColor(theme: AppTheme, color?: TextColor): string {
  if (!color) return theme.text.primary
  if (isTextColorToken(theme, color)) {
    return color in theme.text
      ? theme.text[color as keyof AppTheme['text']]
      : theme.status[color as keyof AppTheme['status']].foreground
  }

  return color
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
