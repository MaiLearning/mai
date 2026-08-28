import { NodeViewWrapper } from '@tiptap/react'
import styled, { css } from 'styled-components'

// ─────────────────────────  Callout  ─────────────────────────

/** Заметка-выноска: цветной фон по тону, иконка слева, редактируемое содержимое. */
export const CalloutBox = styled(NodeViewWrapper)<{ $tone: 'info' | 'accent' | 'success' }>`
  position: relative;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme, $tone }) =>
    $tone === 'accent'
      ? theme.colors.accentSurface
      : $tone === 'success'
        ? theme.colors.successSurface
        : theme.colors.infoSurface};

  &[data-selected='true'] {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  > svg {
    flex: none;
    margin-top: 3px;
    color: ${({ theme, $tone }) =>
      $tone === 'accent'
        ? theme.colors.accent
        : $tone === 'success'
          ? theme.colors.success
          : theme.colors.info};
  }

  .th-callout-content {
    flex: 1;
    min-width: 0;

    p {
      margin: 0;
      font-size: 15px;
    }

    > * + * {
      margin-top: ${({ theme }) => theme.spacing.sm};
    }
  }
`

/** Мини-переключатель тона — виден при выделении узла. */
export const ToneSwitch = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

export const ToneSwitchDot = styled.button<{ $tone: string; $active?: boolean }>`
  width: 14px;
  height: 14px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  background: ${({ theme, $tone }) =>
    $tone === 'success'
      ? theme.colors.success
      : $tone === 'accent'
        ? theme.colors.accent
        : theme.colors.info};

  ${({ theme, $active }) =>
    $active &&
    css`
      border-color: ${theme.colors.textMuted};
    `}
`
