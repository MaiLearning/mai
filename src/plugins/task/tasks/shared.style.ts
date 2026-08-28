import styled, { css } from 'styled-components'

/**
 * Общий контейнер тела варианта задачи.
 * Задаёт вертикальный ритм и типографику для условия (.prompt).
 */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  .prompt {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.display};
  }
`

/** Небольшая подпись-секция («Варианты ответа», «Сопоставьте пары»). */
export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

/**
 * Строка-вариант (используется в single/multiple choice).
 * Поддерживает выбранное состояние и статусы правильности.
 */
export const OptionRow = styled.div<{
  $selected?: boolean
  $state?: 'idle' | 'correct' | 'incorrect'
  $editing?: boolean
}>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $editing }) => ($editing ? 'default' : 'pointer')};

  &:hover {
    border-color: ${({ theme, $editing }) =>
      $editing ? theme.colors.border : theme.colors.borderStrong};
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primarySurface};
    `}

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

/** Маркер-кружок/квадрат слева от варианта. */
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
  border: 2px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ $shape }) => ($shape === 'circle' ? '999px' : '6px')};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $checked, theme }) =>
    $checked &&
    css`
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primary};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.success};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.colors.danger};
      background: ${theme.colors.danger};
    `}
`

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

/** Кнопка добавления нового элемента в режиме редактирования. */
export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }
`

/** Кнопка-иконка удаления, появляется у элементов в режиме редактирования. */
export const RemoveButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSurface};
  }
`

/** Бейдж «правильный ответ» в режиме редактирования. */
export const CorrectBadge = styled.button<{ $on: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme, $on }) => ($on ? theme.colors.success : theme.colors.border)};
  background: ${({ theme, $on }) => ($on ? theme.colors.successSurface : 'transparent')};
  color: ${({ theme, $on }) => ($on ? theme.colors.success : theme.colors.textMuted)};
  font-size: 0.75rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.success};
  }
`
