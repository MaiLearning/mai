import styled from 'styled-components'
import { IconButton } from '@/app/theme/components/IconButton'

/** Кнопка инструмента на базе IconButton приложения, с состоянием «активно». */
export const ToolButton = styled(IconButton)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.colors.primarySurface};
    color: ${theme.colors.primary};

    &:hover {
      background: ${theme.colors.primarySurface};
      color: ${theme.colors.primary};
    }
  `}

  &:disabled {
    opacity: 0.35;
    cursor: default;

    &:hover {
      background: transparent;
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`

/** Липкая панель инструментов над листом документа. */
export const ToolbarRoot = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  padding: 6px ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
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
  color: ${({ theme }) => theme.colors.textMuted};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 13px;
  font-weight: 500;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border-color: ${({ theme }) => theme.colors.borderStrong};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const BlockMenuItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 7px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.colors.primarySurface};
    color: ${theme.colors.primary};
    font-weight: 600;
  `}
`
