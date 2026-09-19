import styled, { css } from 'styled-components'

/** Параграф задачи: текст сегментов и пропуска; в редакторе — contentEditable-холст. */
const Paragraph = styled.div<{ $editable?: boolean }>`
  font-size: 1.0625rem;
  line-height: 2.1;
  color: ${({ theme }) => theme.text.primary};

  ${({ $editable }) =>
    $editable &&
    css`
      min-height: 3.15em;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      cursor: text;
      border-radius: ${({ theme }) => theme.radius.sm};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border.default};
      transition: box-shadow ${({ theme }) => theme.durations.fast};

      &:hover {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border.strong};
      }

      /* Гасим глобальный :focus-visible, как в EditableText: контур рисует рамка поля */
      &:focus,
      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border.accent};
      }
    `}
`

/** Поле ввода пропуска в режиме прохождения. */
const Blank = styled.input<{
  $state?: 'idle' | 'correct' | 'incorrect'
  $locked?: boolean
}>`
  display: inline-block;
  min-width: 120px;
  width: 120px;
  margin: 0 4px;
  padding: 4px 10px;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.border.strong};
  border-radius: ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0 0;
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font: inherit;
  font-size: 1rem;
  text-align: center;
  transition: all ${({ theme }) => theme.durations.fast};
  cursor: ${({ $locked }) => ($locked ? 'default' : 'text')};

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
  }

  &:focus {
    outline: none;
  }

  /* Активное поле — акцентные подчёркивание и подсветка; у зафиксированного ввода акцентов нет. */
  ${({ $locked, theme }) =>
    !$locked &&
    css`
      &:focus {
        border-bottom-color: ${theme.border.accent};
        background: ${theme.background.accentSubtle};
      }
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-bottom-color: ${theme.status.success.foreground};
      background: ${theme.status.success.background};
      color: ${theme.status.success.foreground};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-bottom-color: ${theme.status.danger.foreground};
      background: ${theme.status.danger.background};
      color: ${theme.status.danger.foreground};
    `}
`

/** Чип пропуска в редакторе — несъедобный (contentEditable=false), показывает эталонный ответ. */
const BlankToken = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0 4px;
  padding: 2px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px dashed ${({ theme }) => theme.border.accent};
  background: ${({ theme }) => theme.background.accentSubtle};
  color: ${({ theme }) => theme.text.accent};
  font-size: 0.9375rem;
  font-weight: 600;
`

/** Крестик «убрать пропуск» внутри чипа. */
const ChipRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.status.danger.foreground};
  }
`

/** Инлайн-инпут правки эталонного ответа чипа (двойной клик). */
const InlineInput = styled.input`
  width: 140px;
  padding: 0 2px;
  border: none;
  border-bottom: 1px solid currentcolor;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  outline: none;
`

/** Панель инструментов редактора над параграфом. */
const Toolbar = styled.div`
  display: flex;
  gap: 8px;
`

const ToolbarButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.75rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.border.accent};
    color: ${({ theme }) => theme.text.accent};
    background: ${({ theme }) => theme.background.accentSubtle};
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`

export { Blank, BlankToken, ChipRemove, InlineInput, Paragraph, Toolbar, ToolbarButton }
