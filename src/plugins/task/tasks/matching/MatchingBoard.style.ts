import styled, { css } from 'styled-components'

/** Список строк доски «термин → слот». */
export const Board = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

/** Строка доски: термин слева, слот-дроп-зона справа. */
export const RowSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

/** Текст термина. */
export const Term = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`

/** Дроп-зона под определение: пустая — dashed; $over — primary; после проверки — success/danger. */
export const Slot = styled.div<{ $state?: 'idle' | 'correct' | 'incorrect'; $over?: boolean }>`
  flex: 1;
  max-width: 320px;
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $over, theme }) =>
    $over &&
    css`
      border-style: solid;
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primarySurface};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-style: solid;
      border-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-style: solid;
      border-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
    `}
`

/** Плейсхолдер пустого слота. */
export const SlotPlaceholder = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8125rem;
`

/** Фишка-определение; гаснущий источник перетаскивания — opacity 0.4. */
export const Chip = styled.div<{ $dragging?: boolean }>`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $dragging, theme }) =>
    $dragging &&
    css`
      opacity: 0.4;
      border-color: ${theme.colors.primary};
    `}
`

/** Зона пула нераспределённых фишек. */
export const Pool = styled.div<{ $over?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-height: 64px;
  padding: 12px 14px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $over, theme }) =>
    $over &&
    css`
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primarySurface};
    `}
`

/** Подсказка пустого пула. */
export const PoolHint = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8125rem;
`
