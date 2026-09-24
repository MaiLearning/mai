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
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
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
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'sunken')};
  transition: all ${({ theme }) => theme.durations.fast};

  ${({ $over, theme }) =>
    $over &&
    css`
      border-style: solid;
      border-color: ${theme.utils.getBorder('accent', 'default')};
      background: ${theme.utils.getBackground('accent', 'surface')};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-style: solid;
      border-color: ${theme.utils.getBorder('success', 'default')};
      background: ${theme.utils.getBackground('success', 'surface')};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-style: solid;
      border-color: ${theme.utils.getBorder('danger', 'default')};
      background: ${theme.utils.getBackground('danger', 'surface')};
    `}
`

/** Плейсхолдер пустого слота. */
export const SlotPlaceholder = styled.span`
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 0.8125rem;
`

/** Фишка-определение; гаснущий источник перетаскивания — opacity 0.4; при locked — без grab и hover-акцента. */
export const Chip = styled.div<{ $dragging?: boolean; $locked?: boolean }>`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 0.875rem;
  cursor: ${({ $locked }) => ($locked ? 'default' : 'grab')};
  user-select: none;
  touch-action: none;
  transition:
    opacity ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme, $locked }) => ($locked ? theme.utils.getBorder('neutral', 'strong') : theme.utils.getBorder('accent', 'default'))};
  }

  ${({ $dragging, theme }) =>
    $dragging &&
    css`
      opacity: 0.4;
      border-color: ${theme.utils.getBorder('accent', 'default')};
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
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'sunken')};
  transition: all ${({ theme }) => theme.durations.fast};

  ${({ $over, theme }) =>
    $over &&
    css`
      border-color: ${theme.utils.getBorder('accent', 'default')};
      background: ${theme.utils.getBackground('accent', 'surface')};
    `}
`

/** Подсказка пустого пула. */
export const PoolHint = styled.span`
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 0.8125rem;
`
