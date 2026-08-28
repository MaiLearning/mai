import styled, { css } from 'styled-components'

/**
 * Редактируемое текстовое поле в стиле WYSIWYG.
 * В режиме solve — обычный текст. В режиме edit — при наведении подсвечивается
 * рамкой и превращается в contentEditable-подобное поле.
 */
export const Editable = styled.div<{ $editing: boolean; $muted?: boolean }>`
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ $editing }) => ($editing ? '6px 10px' : '0')};
  margin: ${({ $editing }) => ($editing ? '-6px -10px' : '0')};
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textMuted : 'inherit')};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};
  outline: none;

  ${({ $editing, theme }) =>
    $editing &&
    css`
      cursor: text;
      box-shadow: inset 0 0 0 1px ${theme.colors.border};

      &:hover {
        box-shadow: inset 0 0 0 1px ${theme.colors.borderStrong};
      }

      &:focus {
        background: ${theme.colors.body};
        box-shadow: inset 0 0 0 1px ${theme.colors.primary};
      }
    `}
`
