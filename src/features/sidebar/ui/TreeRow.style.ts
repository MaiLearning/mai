import styled, { css } from 'styled-components'

export const Row = styled.div<{
  $selected: boolean
  $indent: number
  $overlay?: boolean
  $dimmed?: boolean
  /** Строка — цель дропа «внутрь»: подсветка папки-приёмника. */
  $dropInside?: boolean
  /** Строка — цель вставки до/после: линия на соответствующем крае строки. */
  $dropLine?: 'before' | 'after' | null
}>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding-right: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ $indent, theme }) => `calc(${theme.spacing.sm} + ${$indent}px)`};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.text : theme.colors.textMuted)};
  cursor: pointer;
  user-select: none;
  touch-action: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ $dimmed }) =>
    $dimmed &&
    css`
      opacity: 0.4;
    `}

  ${({ $dropInside, theme }) =>
    $dropInside &&
    css`
      background: ${theme.colors.primarySurface};
      box-shadow: inset 0 0 0 1px ${theme.colors.primary};

      &:hover {
        background: ${theme.colors.primarySurface};
      }
    `}

  ${({ $dropLine, $indent, theme }) =>
    $dropLine &&
    css`
      &::after {
        content: '';
        position: absolute;
        left: calc(${theme.spacing.sm} + ${$indent}px - 4px);
        right: ${({ theme }) => theme.spacing.sm};
        ${$dropLine === 'before' ? 'top: -3px;' : 'bottom: -3px;'}
        height: 2px;
        border-radius: ${({ theme }) => theme.radii.pill};
        background: ${({ theme }) => theme.colors.primary};
        pointer-events: none;
      }
    `}

  ${({ $overlay }) =>
    $overlay &&
    css`
      cursor: grabbing;

      &:hover {
        background: transparent;
      }
    `}

  ${({ $selected, theme }) =>
    $selected &&
    css`
      background: ${theme.colors.primarySurface};

      &:hover {
        background: ${theme.colors.primarySurface};
      }

      &::before {
        content: '';
        position: absolute;
        top: 6px;
        bottom: 6px;
        left: 2px;
        width: 2px;
        border-radius: ${theme.radii.pill};
        background: ${theme.colors.primary};
      }
    `}
`

export const Twisty = styled.span<{ $visible: boolean; $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: rotate(${({ $expanded }) => ($expanded ? 90 : 0)}deg);
  transition: transform ${({ theme }) => theme.transitions.fast};
`

export const NodeIcon = styled.span<{ $folder: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ $folder, theme }) => ($folder ? theme.colors.primary : theme.colors.textMuted)};
`

export const Title = styled.span<{ $folder: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: ${({ $folder }) => ($folder ? 600 : 500)};
  letter-spacing: -0.005em;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RenameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 2px 4px;
  border: 1px solid ${({ theme }) => theme.colors.focus};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  font-weight: inherit;
  outline: none;
`

const toneMap = {
  neutral: 'border',
  accent: 'accent',
  success: 'success',
  danger: 'danger',
  info: 'info',
} as const

export { toneMap }

export const Badge = styled.span<{ $tone: keyof typeof toneMap }>`
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  ${({ $tone, theme }) =>
    $tone === 'neutral'
      ? css`
          background: ${theme.colors.surfaceElevated};
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.textMuted};
        `
      : css`
          background: ${theme.colors[`${$tone}Surface` as const]};
          color: ${theme.colors[$tone as 'accent' | 'success' | 'danger' | 'info']};
        `}
`

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0;
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  ${Row}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.dangerSurface};
    color: ${({ theme }) => theme.colors.danger};
  }
`
