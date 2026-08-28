import styled, { css } from 'styled-components'
import { ROW_INDENT } from './TreeRow'
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

export const RowSlot = styled.div<{ $level: number }>`
  position: relative;

  --guide-offset: ${({ $level, theme }) =>
    `calc(${theme.spacing.sm} + ${($level - 1) * ROW_INDENT}px + 17px)`};
`

export const Guide = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--guide-offset);
  width: 1px;
  background: ${({ theme }) => theme.colors.border};
  pointer-events: none;
`

/** Плавающая карточка под курсором: копия строки + подпись цели дропа. */
export const OverlayCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 240px;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

export const OverlayHint = styled.div`
  overflow: hidden;
  padding: 1px 4px;
  color: ${({ theme }) => theme.colors.textMuted};
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
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
`

export const EmptyTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 600;
`

export const EmptyHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.5;
`
