import { css, styled } from 'styled-components'

export interface FieldControlProps {
  $invalid?: boolean
}

/**
 * Общий визуал контрола всех полей: размеры, фон, граница, hover/disabled
 * через оверлеи состояния, фокус-кольцо из токена темы. Вариант `$invalid`
 * красит границу в danger. Источник один для всех полей — примитив базиса.
 */
export const fieldControlCss = css<FieldControlProps>`
  min-height: 36px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  box-sizing: border-box;
  width: 100%;

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
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

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $invalid }) =>
      $invalid
        ? theme.utils.withState(theme.utils.getBorder('danger', 'default'), 'hoverAlpha')
        : theme.utils.withState(theme.utils.getBorder('neutral', 'default'), 'hoverAlpha')};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  }

  &:disabled {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    cursor: not-allowed;
  }
`

export const FieldInputRoot = styled.input<FieldControlProps>`
  ${fieldControlCss}
`

/** Кнопка-адорнмент внутри поля (глаз пароля, очистка, степперы). */
export const FieldAdornmentButton = styled.button`
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
