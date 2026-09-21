import styled from 'styled-components'

/** Обёртка CodeMirror: рамка как у полей ввода, тема приложения поверх дефолтной. */
export const EditorWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.background.surface};

  .cm-editor {
    background: transparent;
    font-size: 0.875rem;
  }

  .cm-editor.cm-focused {
    outline: none;
  }

  .cm-gutters {
    background: transparent;
    border-right: 1px solid ${({ theme }) => theme.border.default};
    color: ${({ theme }) => theme.text.muted};
  }

  .cm-content {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    padding: 12px 0;
  }

  .cm-line {
    padding: 0 14px;
  }

  .cm-activeLine {
    background: ${({ theme }) => theme.background.elevated};
  }

  .cm-activeLineGutter {
    background: transparent;
    color: ${({ theme }) => theme.text.primary};
  }

  .cm-cursor {
    border-left-color: ${({ theme }) => theme.text.primary};
  }

  ::selection,
  .cm-selectionBackground,
  .cm-content ::selection {
    background: ${({ theme }) => theme.background.accentSubtle} !important;
  }

  .cm-scroller {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    line-height: 1.55;
  }
`
