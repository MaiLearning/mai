import { GripVertical } from 'lucide-react'
import styled, { css } from 'styled-components'

/** Визуальное состояние строки: подсветка результата проверки (solve). */
export type RowState = 'idle' | 'correct' | 'incorrect'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Item = styled.div<{
  $state?: RowState
  $editing?: boolean
  $locked?: boolean
}>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  cursor: ${({ $editing, $locked }) => ($editing || $locked ? 'default' : 'grab')};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme, $editing, $locked }) =>
      $editing || $locked
        ? theme.utils.getBorder('neutral', 'default')
        : theme.utils.getBorder('neutral', 'strong')};
  }

  /* Текст тянется на всё свободное место строки */
  > .item-text {
    flex: 1;
    min-width: 0;
  }

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.utils.getBorder('success', 'default')};
      background: ${theme.utils.getBackground('success', 'surface')};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.utils.getBorder('danger', 'default')};
      background: ${theme.utils.getBackground('danger', 'surface')};
    `}
`

export const Index = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  font-weight: 600;
`

export const Grip = styled(GripVertical)<{ $locked?: boolean }>`
  flex-shrink: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  cursor: ${({ $locked }) => ($locked ? 'default' : 'grab')};
`
