import styled, { css } from 'styled-components'

/**
 * Редактируемое текстовое поле в стиле WYSIWYG.
 * В режиме solve — обычный текст. В режиме edit — при наведении подсвечивается
 * рамкой и превращается в contentEditable-подобное поле.
 */
export const Editable = styled.div<{
  $editing: boolean
  $muted?: boolean
  $grow: boolean
  $offset: boolean
}>`
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ $editing }) => ($editing ? '6px 10px' : '0')};
  /* Компенсация padding: текст не сдвигается между режимами; в строках отключается */
  margin: ${({ $editing, $offset }) => ($editing && $offset ? '-6px -10px' : '0')};
  color: ${({ theme, $muted }) => ($muted ? theme.text.muted : 'inherit')};
  transition:
    background ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};
  outline: none;

  ${({ $editing, theme }) =>
    $editing &&
    css`
      min-width: 160px;
      cursor: text;

      &:hover {
        box-shadow: inset 0 0 0 1px ${theme.border.strong};
      }

      /* Гасим глобальный :focus-visible — иначе вокруг собственного
         внутреннего кольца рисуется второй контур. */
      &:focus,
      &:focus-visible {
        outline: none;
        background: ${theme.background.body};
        box-shadow: inset 0 0 0 1px ${theme.border.accent};
      }

      &:empty::before {
        content: attr(data-placeholder);
        color: ${theme.text.muted};
        pointer-events: none;
      }
    `}

  /* Авто-рост на всю ширину: длинный текст виден целиком при редактировании */
  ${({ $editing, $grow }) =>
    $editing &&
    $grow &&
    css`
      width: 100%;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    `}
`
