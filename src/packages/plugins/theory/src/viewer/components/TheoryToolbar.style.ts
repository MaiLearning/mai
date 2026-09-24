import { Button } from '@mai/theme'
import styled from 'styled-components'

/** Кнопка инструмента на базе Button: ghost-вариант с активным состоянием. */
export const ToolButton = styled(Button).attrs({ variant: 'ghost', size: 'sm' } as const)`
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:disabled {
    background: transparent;
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  }
`

/** Панель инструментов над листом документа (вне скролл-контейнера — sticky не нужен). */
export const ToolbarRoot = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  padding: 6px ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
`

export const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

export const ToolbarSpacer = styled.span`
  flex: 1;
`

export const WordCount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  white-space: nowrap;
`

// ─────────────────────────  Выбор типа блока  ─────────────────────────

export const BlockSelectWrap = styled.div`
  position: relative;
`

export const BlockSelect = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  transition:
    background ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  }

  > svg:last-child {
    opacity: 0.5;
  }
`

export const BlockMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const BlockMenuItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 7px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &:hover,
  &[data-cursor='true'] {
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.utils.getBackground('accent', 'surface')};
    color: ${theme.utils.getText('accent', 'primary')};
    font-weight: 600;
  `}
`
