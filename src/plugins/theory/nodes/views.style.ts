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

// ─────────────────────────  Embed (видео)  ─────────────────────────

/** Каркас видео-вставки: рамка, радиус, скрытие переполнения. */
export const EmbedFigure = styled(NodeViewWrapper)`
  margin: ${({ theme }) => theme.spacing.md} 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;

  &[data-selected='true'] {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`

/** Поле 16:9 с кнопкой воспроизведения. */
export const EmbedFrame = styled.button`
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  background:
    radial-gradient(
      circle at 50% 45%,
      ${({ theme }) => theme.colors.primarySurface},
      transparent 65%
    ),
    ${({ theme }) => theme.colors.surfaceElevated};

  svg {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition:
      transform ${({ theme }) => theme.transitions.fast},
      background ${({ theme }) => theme.transitions.fast};
  }

  &:hover svg {
    transform: scale(1.06);
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`

/** Настройка вставки без ссылки: подсказка + ввод URL. */
export const EmbedSetup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  aspect-ratio: 16 / 9;
  color: ${({ theme }) => theme.colors.textMuted};
  background:
    radial-gradient(
      circle at 50% 45%,
      ${({ theme }) => theme.colors.primarySurface},
      transparent 65%
    ),
    ${({ theme }) => theme.colors.surfaceElevated};
`

export const SetupInput = styled.input`
  width: min(100%, 360px);
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/** Строка подписи под каркасом. */
export const EmbedCaptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 8px 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const CaptionInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;

  &::placeholder {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.text};
  }
`
