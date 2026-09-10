import styled from 'styled-components'

/** Обёртка CodeMirror: рамка как у полей ввода, тема приложения поверх дефолтной. */
export const EditorWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};

  .cm-editor {
    background: transparent;
    font-size: 0.875rem;
  }

  .cm-editor.cm-focused {
    outline: none;
  }

  .cm-gutters {
    background: transparent;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .cm-content {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    padding: 12px 0;
  }

  .cm-line {
    padding: 0 14px;
  }

  .cm-activeLine {
    background: ${({ theme }) => theme.colors.surfaceElevated};
  }

  .cm-activeLineGutter {
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
  }

  .cm-cursor {
    border-left-color: ${({ theme }) => theme.colors.text};
  }

  ::selection,
  .cm-selectionBackground,
  .cm-content ::selection {
    background: ${({ theme }) => theme.colors.primarySurface} !important;
  }

  .cm-scroller {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    line-height: 1.55;
  }
`
