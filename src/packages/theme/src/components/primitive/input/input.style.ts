import { css, styled } from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { InputSize } from './input'

export interface InputShellProps {
  $invalid: boolean
  $disabled: boolean
  $size: InputSize
}

/**
 * Общая оболочка контрола ввода: фон, граница, hover/disabled через
 * оверлеи состояния, фокус-кольцо из токена темы. Применяется к
 * контейнеру группы ввода (`InputContainer`) и к полноценным контролам
 * (textarea). Вариант `$invalid` красит границу в danger.
 */
export const inputShellCss = css<Omit<InputShellProps, '$size'>>`
  box-sizing: border-box;
  width: 100%;

  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};

  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  border: 1px solid
    ${({ theme, $invalid }) =>
      $invalid
        ? theme.utils.getBorder('danger', 'default')
        : theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};

  transition:
    border-color ${({ theme }) => theme.durations.fast},
    background-color ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme, $invalid, $disabled }) =>
      $disabled
        ? theme.utils.getBorder($invalid ? 'danger' : 'neutral', 'default')
        : theme.utils.withState(
            theme.utils.getBorder($invalid ? 'danger' : 'neutral', 'default'),
            'hoverAlpha',
          )};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      background: ${({ theme }) =>
        theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
      color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
      cursor: not-allowed;
    `}
`

/** Размерная шкала оболочки: высота, горизонтальный паддинг, типографика. */
export function inputShellSize(theme: AppTheme, size: InputSize) {
  const sizes: Record<InputSize, ReturnType<typeof css>> = {
    sm: css`
      min-height: 32px;
      padding: 0 ${theme.spacing.sm};
      font-size: ${theme.typography.sizes.sm};
      line-height: ${theme.typography.lineHeights.normal};
    `,
    md: css`
      min-height: 36px;
      padding: 0 ${theme.spacing.md};
      font-size: ${theme.typography.sizes.md};
      line-height: ${theme.typography.lineHeights.normal};
    `,
    lg: css`
      min-height: 40px;
      padding: 0 ${theme.spacing.lg};
      font-size: ${theme.typography.sizes.lg};
      line-height: ${theme.typography.lineHeights.normal};
    `,
  }

  return sizes[size]
}

/** Контейнер группы ввода: нативный input + опциональные start/endContent. */
export const InputContainer = styled.div<InputShellProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${inputShellCss}
  ${({ theme, $size }) => inputShellSize(theme, $size)}
`

/** Нативный input внутри группы: прозрачный, без рамки — визуал несёт контейнер. */
export const InputControl = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;

  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  }

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    appearance: none;
  }
`

/** Кнопка-адорнмент внутри группы ввода (глаз пароля, очистка, степперы). */
export const InputAdornmentButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;
  padding: 0;
  box-sizing: border-box;

  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};

  cursor: pointer;
  transition: color ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 1px;
  }

  &:disabled {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`
