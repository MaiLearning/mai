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
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $tone }) =>
    $tone === 'accent'
      ? theme.background.accentSubtle
      : $tone === 'success'
        ? theme.status.success.background
        : theme.status.info.background};

  &[data-selected='true'] {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }

  > svg {
    flex: none;
    margin-top: 3px;
    color: ${({ theme, $tone }) =>
      $tone === 'accent'
        ? theme.text.accent
        : $tone === 'success'
          ? theme.status.success.foreground
          : theme.status.info.foreground};
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
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.elevated};
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
      ? theme.status.success.foreground
      : $tone === 'accent'
        ? theme.text.accent
        : theme.status.info.foreground};

  ${({ theme, $active }) =>
    $active &&
    css`
      border-color: ${theme.text.muted};
    `}
`
