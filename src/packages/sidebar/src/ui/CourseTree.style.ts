import { themedScrollbar } from '@mai/theme'
import styled, { css } from 'styled-components'
import { Row } from './TreeRow.style'

export const Tree = styled.div<{ $dragging?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};

  /* Во время перетаскивания обычный :hover строк вводит в заблуждение:
     подсвечивается только реальная цель дропа. */
  ${({ $dragging }) =>
    $dragging &&
    css`
      ${Row}:hover {
        background: transparent;
      }
    `}
`

export const RowSlot = styled.div`
  position: relative;
`

/**
 * Скролл-контейнер дерева. `flex: 0 1 auto` (не `flex: 1`): свободное
 * место уходит нижней зоне дропа в корень, а при переполнении контейнер
 * сжимается, оставляя ей минимум 24px.
 */
export const Scroll = styled.div`
  flex: 0 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;

  ${themedScrollbar}
`

/**
 * Постоянная зона дропа «в корень» под скроллом: растягивается на всё
 * свободное место, но не меньше 24px. Вне перетаскивания прозрачна.
 */
export const RootZone = styled.div<{ $visible: boolean; $over: boolean }>`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 24px;
  margin: 0 ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  border: 1px dashed transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  color: transparent;
  font-size: 11px;
  letter-spacing: -0.005em;
  user-select: none;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  ${({ $visible, theme }) =>
    $visible &&
    css`
      border-color: ${theme.utils.getBorder('neutral', 'default')};
      color: ${theme.utils.getText('neutral', 'muted')};
    `}

  ${({ $over, theme }) =>
    $over &&
    css`
      border-color: ${theme.utils.getSolid('accent', 'base')};
      background: ${theme.utils.getBackground('accent', 'surface')};
      color: ${theme.utils.getText('neutral', 'primary')};
    `}
`

/** Плавающая карточка под курсором: копия строки + подпись цели дропа. */
export const OverlayCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 240px;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

export const OverlayHint = styled.div`
  overflow: hidden;
  padding: 1px 4px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 11px;
  letter-spacing: -0.005em;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.lg};
  text-align: center;
`

export const EmptyTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 13px;
  font-weight: 600;
`

export const EmptyHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 12px;
  line-height: 1.5;
`
