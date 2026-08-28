import styled from 'styled-components'
import { ROW_INDENT } from './TreeRow'

export const Tree = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};
`

export const RowSlot = styled.div<{ $level: number; $ghost?: boolean }>`
  position: relative;
  z-index: ${({ $ghost }) => ($ghost ? 1 : 'auto')};

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

export const Indicator = styled.div<{ $indent: number }>`
  position: relative;
  height: 28px;
  margin-left: ${({ $indent, theme }) => `calc(${theme.spacing.sm} + ${$indent}px)`};

  &::after {
    content: '';
    position: absolute;
    left: 10px;
    right: ${({ theme }) => theme.spacing.sm};
    top: 50%;
    height: 2px;
    transform: translateY(-50%);
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 50%;
    width: 9px;
    height: 9px;
    transform: translateY(-50%);
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
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
