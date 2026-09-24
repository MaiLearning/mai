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
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
    font-family: ${({ theme }) => theme.typography.fontFamily};
  }
`

/** Небольшая подпись-секция («Варианты ответа», «Сопоставьте пары»). */
export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
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
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  transition: all ${({ theme }) => theme.durations.fast};
  cursor: ${({ $editing }) => ($editing ? 'default' : 'pointer')};

  &:hover {
    border-color: ${({ theme, $editing }) =>
      $editing
        ? theme.utils.getBorder('neutral', 'default')
        : theme.utils.getBorder('neutral', 'strong')};
  }

  ${({ $selected, theme }) =>
    $selected &&
    css`
      border-color: ${theme.utils.getBorder('accent', 'default')};
      background: ${theme.utils.getBackground('accent', 'surface')};
    `}

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
  border: 2px solid ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  border-radius: ${({ $shape }) => ($shape === 'circle' ? '999px' : '6px')};
  color: ${({ theme }) => theme.contrastText.accent};
  transition: all ${({ theme }) => theme.durations.fast};

  ${({ $checked, theme }) =>
    $checked &&
    css`
      border-color: ${theme.utils.getBorder('accent', 'default')};
      background: ${theme.utils.getSolid('accent', 'base')};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.utils.getSolid('success', 'base')};
      background: ${theme.utils.getSolid('success', 'base')};
      color: ${theme.contrastText.success};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.utils.getSolid('danger', 'base')};
      background: ${theme.utils.getSolid('danger', 'base')};
      color: ${theme.contrastText.danger};
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
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
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
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.utils.getText('danger', 'primary')};
    background: ${({ theme }) => theme.utils.getBackground('danger', 'surface')};
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
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid
    ${({ theme, $on }) => ($on ? theme.utils.getBorder('success', 'default') : theme.utils.getBorder('neutral', 'default'))};
  background: ${({ theme, $on }) => ($on ? theme.utils.getBackground('success', 'surface') : 'transparent')};
  color: ${({ theme, $on }) => ($on ? theme.utils.getText('success', 'primary') : theme.utils.getText('neutral', 'muted'))};
  font-size: 0.75rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('success', 'default')};
    color: ${({ theme }) => theme.utils.getText('success', 'primary')};
  }
`
