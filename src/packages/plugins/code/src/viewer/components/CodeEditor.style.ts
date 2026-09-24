import styled from 'styled-components'

/** Обёртка CodeMirror: рамка как у полей ввода, тема приложения поверх дефолтной. */
export const EditorWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};

  .cm-editor {
    background: transparent;
    font-size: 0.875rem;
  }

  .cm-editor.cm-focused {
    outline: none;
  }

  .cm-gutters {
    background: transparent;
    border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  }

  .cm-content {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    padding: 12px 0;
  }

  .cm-line {
    padding: 0 14px;
  }

  .cm-activeLine {
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  }

  .cm-activeLineGutter {
    background: transparent;
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  .cm-cursor {
    border-left-color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  ::selection,
  .cm-selectionBackground,
  .cm-content ::selection {
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')} !important;
  }

  .cm-scroller {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    line-height: 1.55;
  }
`
