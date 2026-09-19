import styled from 'styled-components'
import { IconButton } from '../../ui'

/** Кнопка инструмента на базе IconButton пакета, с состоянием «активно». */
export const ToolButton = styled(IconButton)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.text.muted};

  &:hover {
    background: ${({ theme }) => theme.background.elevated};
    color: ${({ theme }) => theme.text.primary};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.background.accentSubtle};
    color: ${theme.text.accent};

    &:hover {
      background: ${theme.background.accentSubtle};
      color: ${theme.text.accent};
    }
  `}

  &:disabled {
    opacity: 0.35;
    cursor: default;

    &:hover {
      background: transparent;
      color: ${({ theme }) => theme.text.muted};
    }
  }
`

/** Панель инструментов над листом документа (вне скролл-контейнера — sticky не нужен). */
export const ToolbarRoot = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  padding: 6px ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.elevated};
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
  color: ${({ theme }) => theme.text.muted};
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
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  transition:
    background ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.border.strong};
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
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.elevated};
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
  color: ${({ theme }) => theme.text.primary};
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &:hover,
  &[data-cursor='true'] {
    background: ${({ theme }) => theme.background.elevated};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.background.accentSubtle};
    color: ${theme.text.accent};
    font-weight: 600;
  `}
`
