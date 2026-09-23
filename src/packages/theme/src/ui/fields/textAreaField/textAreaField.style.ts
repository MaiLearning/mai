import { styled } from 'styled-components'
import type { FieldControlProps } from '../../base/field/fieldInput.style'
import { fieldControlCss } from '../../base/field/fieldInput.style'

/** Общий визуал инпута, адаптированный под многострочное поле. */
export const TextAreaRoot = styled.textarea<FieldControlProps>`
  ${fieldControlCss}

  min-height: 96px;
  height: auto;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  resize: vertical;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    white-space: pre-wrap;
  }
`
