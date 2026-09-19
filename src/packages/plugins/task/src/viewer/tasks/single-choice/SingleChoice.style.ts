import styled, { css } from 'styled-components'

/**
 * Строка-вариант. Solve: маркер + текст. Edit: поле (flex: 1) + бейдж «Верный»
 * + удаление — единый gap, без компенсационных полей у текстового поля.
 */
export const OptionRow = styled.div<{
  $selected?: boolean
  $state?: 'idle' | 'correct' | 'incorrect'
  $editing?: boolean
  $locked?: boolean
}>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  transition: all ${({ theme }) => theme.durations.fast};
  cursor: ${({ $editing, $locked }) => ($editing || $locked ? 'default' : 'pointer')};

  &:hover {
    border-color: ${({ theme, $editing, $locked }) =>
      $editing || $locked ? theme.border.default : theme.border.strong};
  }

  /* Поле варианта занимает всё свободное место строки */
  .option-text {
    flex: 1;
    min-width: 0;
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.border.accent};
      background: ${theme.background.accentSubtle};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.status.success.foreground};
      background: ${theme.status.success.background};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.status.danger.foreground};
      background: ${theme.status.danger.background};
    `}
`

/** Маркер-кружок слева от варианта (только solve). */
export const Marker = styled.span<{
  $shape: 'circle' | 'square'
  $checked?: boolean
  $state?: 'idle' | 'correct' | 'incorrect'
}>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid ${({ theme }) => theme.border.strong};
  border-radius: ${({ $shape }) => ($shape === 'circle' ? '999px' : '6px')};
  color: ${({ theme }) => theme.text.onPrimary};
  transition: all ${({ theme }) => theme.durations.fast};

  ${({ $checked, theme }) =>
    $checked &&
    css`
      border-color: ${theme.border.accent};
      background: ${theme.background.accent};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.status.success.foreground};
      background: ${theme.status.success.foreground};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.status.danger.foreground};
      background: ${theme.status.danger.foreground};
    `}
`

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

/** Кнопка добавления нового варианта. */
export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px dashed ${({ theme }) => theme.border.strong};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.text.accent};
    border-color: ${({ theme }) => theme.border.accent};
    background: ${({ theme }) => theme.background.accentSubtle};
  }
`

/** Кнопка-иконка удаления варианта (edit). */
export const RemoveButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.status.danger.foreground};
    background: ${({ theme }) => theme.status.danger.background};
  }
`

/** Бейдж «правильный ответ» — тумблер в режиме редактирования. */
export const CorrectBadge = styled.button<{ $on: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid
    ${({ theme, $on }) => ($on ? theme.status.success.foreground : theme.border.default)};
  background: ${({ theme, $on }) => ($on ? theme.status.success.background : 'transparent')};
  color: ${({ theme, $on }) => ($on ? theme.status.success.foreground : theme.text.muted)};
  font-size: 0.75rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.status.success.foreground};
    color: ${({ theme }) => theme.status.success.foreground};
  }
`
