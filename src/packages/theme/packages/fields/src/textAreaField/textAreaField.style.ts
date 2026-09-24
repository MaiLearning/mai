import { styled } from 'styled-components'
import { themedScrollbar } from '../../../../src/components/foundation/scrollArea/scrollArea.style'
import type { InputShellProps } from '../../../../src/components/primitive/input/input.style'
import {
  inputShellCss,
  inputShellSize,
} from '../../../../src/components/primitive/input/input.style'

/** Общая оболочка контрола ввода, адаптированная под многострочное поле. */
export const TextAreaRoot = styled.textarea<InputShellProps>`
  ${inputShellCss}
  ${themedScrollbar}

  ${({ theme, $size }) => inputShellSize(theme, $size)}

  min-height: 96px;
  height: auto;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  white-space: pre-wrap;
  overflow-wrap: break-word;
  resize: vertical;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    white-space: pre-wrap;
  }
`
