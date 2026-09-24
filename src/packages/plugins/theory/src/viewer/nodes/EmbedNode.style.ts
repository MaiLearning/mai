import { NodeViewWrapper } from '@tiptap/react'
import styled from 'styled-components'

// ─────────────────────────  Embed (видео)  ─────────────────────────

/** Каркас видео-вставки: рамка, радиус, скрытие переполнения. */
export const EmbedFigure = styled(NodeViewWrapper)`
  margin: ${({ theme }) => theme.spacing.md} 0;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  overflow: hidden;

  &[data-selected='true'] {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
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
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  background:
    radial-gradient(
      circle at 50% 45%,
      ${({ theme }) => theme.utils.getBackground('accent', 'surface')},
      transparent 65%
    ),
    ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};

  svg {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
    color: ${({ theme }) => theme.contrastText.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition:
      transform ${({ theme }) => theme.durations.fast},
      background ${({ theme }) => theme.durations.fast};
  }

  &:hover svg {
    transform: scale(1.06);
    background: ${({ theme }) => theme.utils.getSolid('accent', 'hover')};
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  background:
    radial-gradient(
      circle at 50% 45%,
      ${({ theme }) => theme.utils.getBackground('accent', 'surface')},
      transparent 65%
    ),
    ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
`

export const SetupInput = styled.input`
  width: min(100%, 360px);
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 13px;

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
  }

  &[data-invalid='true'] {
    border-color: ${({ theme }) => theme.utils.getBorder('danger', 'default')};
    color: ${({ theme }) => theme.utils.getText('danger', 'primary')};
  }
`

/** Строка подписи под каркасом. */
export const EmbedCaptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 8px 14px;
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

export const CaptionInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 13px;

  &::placeholder {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`
