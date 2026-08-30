import styled, { css } from 'styled-components'

/** Параграф задачи: текст сегментов и пропуска; в редакторе — contentEditable-холст. */
const Paragraph = styled.div<{ $editable?: boolean }>`
  font-size: 1.0625rem;
  line-height: 2.1;
  color: ${({ theme }) => theme.colors.text};

  ${({ $editable }) =>
    $editable &&
    css`
      min-height: 3.15em;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      cursor: text;
      border-radius: ${({ theme }) => theme.radii.sm};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border};
      transition: box-shadow ${({ theme }) => theme.transitions.fast};

      &:hover {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.borderStrong};
      }

      /* Гасим глобальный :focus-visible, как в EditableText: контур рисует рамка поля */
      &:focus,
      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.primary};
      }
    `}
`

/** Поле ввода пропуска в режиме прохождения. */
const Blank = styled.input<{ $state?: 'idle' | 'correct' | 'incorrect' }>`
  display: inline-block;
  min-width: 120px;
  width: 120px;
  margin: 0 4px;
  padding: 4px 10px;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm} ${({ theme }) => theme.radii.sm} 0 0;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 1rem;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-bottom-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
      color: ${theme.colors.success};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-bottom-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
      color: ${theme.colors.danger};
    `}
`

/** Чип пропуска в редакторе — несъедобный (contentEditable=false), показывает эталонный ответ. */
const BlankToken = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0 4px;
  padding: 2px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
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
  border-radius: ${({ theme }) => theme.radii.pill};
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
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
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`

export { Blank, BlankToken, ChipRemove, InlineInput, Paragraph, Toolbar, ToolbarButton }
