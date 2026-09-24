import styled from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { TextColor } from '../../foundation/text/text'

export interface LinkRootProps {
  $color: TextColor
  $underline: 'always' | 'hover' | 'none'
}

function resolveLinkColor(theme: AppTheme, color: TextColor): string {
  switch (color) {
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

export const LinkRoot = styled.a<LinkRootProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: inherit;
  font-weight: inherit;
  color: ${(p) => resolveLinkColor(p.theme, p.$color)};

  text-decoration: ${({ $underline }) => ($underline === 'always' ? 'underline' : 'none')};
  text-underline-offset: 3px;

  cursor: pointer;
  transition: color ${({ theme }) => theme.durations.fast};

  &:hover {
    text-decoration: ${({ $underline }) => ($underline === 'hover' ? 'underline' : 'none')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`
