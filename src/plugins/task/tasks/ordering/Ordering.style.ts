import { GripVertical } from 'lucide-react'
import styled, { css } from 'styled-components'

/** Визуальное состояние строки: подсветка результата проверки (solve). */
export type RowState = 'idle' | 'correct' | 'incorrect'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Item = styled.div<{ $state?: RowState; $editing?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: ${({ $editing }) => ($editing ? 'default' : 'grab')};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  /* Текст тянется на всё свободное место строки */
  > .item-text {
    flex: 1;
    min-width: 0;
  }

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
    `}
`

export const Index = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  font-weight: 600;
`

export const Grip = styled(GripVertical)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: grab;
`
