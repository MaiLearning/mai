import styled from 'styled-components'
import type { IntentName } from '../../../base/theme'
import type { BadgeVariant } from './badge'

export interface BadgeRootProps {
  $tone: IntentName
  $variant: BadgeVariant
}

export const BadgeRoot = styled.span<BadgeRootProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  padding: 2px 8px;

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  line-height: 1.4;
  white-space: nowrap;

  background: ${({ theme, $tone, $variant }) =>
    $variant === 'solid'
      ? theme.utils.getSolid($tone, 'base')
      : theme.utils.withState(theme.utils.getBackground($tone, 'surface'), 'hoverAlpha')};
  color: ${({ theme, $tone, $variant }) =>
    $variant === 'solid' ? theme.contrastText[$tone] : theme.utils.getText($tone, 'primary')};

  border-radius: ${({ theme }) => theme.radius.full};
`
