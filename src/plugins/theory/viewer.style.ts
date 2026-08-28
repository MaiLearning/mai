import { EditorContent } from '@tiptap/react'
import styled from 'styled-components'

// ─────────────────────────  Корневая зона viewer  ─────────────────────────

/** Корневая зона viewer — занимает всё доступное пространство. */
export const ViewerRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
`

// ─────────────────────────  Layout: Canvas + Aside  ─────────────────────────

export const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
`

/** Прокручиваемая рабочая область с листом документа по центру. */
export const Canvas = styled.div.attrs({ className: 'app-scroll', 'data-lenis-prevent': 'true' })`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`

/** Лист документа — колонка текста фиксированной ширины. */
export const Sheet = styled.article`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding-bottom: 120px;
`

// ─────────────────────────  Документ (TipTap)  ─────────────────────────

/**
 * Область редактируемого документа.
 *
 * Стили применяются к DOM, который генерирует TipTap:
 * обёртка EditorContent → .ProseMirror → блочные элементы.
 * Вся типографика — на токенах темы приложения.
 */
export const Prose = styled(EditorContent)`
  font-size: 16px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.text};

  &:focus,
  .ProseMirror:focus {
    outline: none;
  }

  .ProseMirror {
    caret-color: ${({ theme }) => theme.colors.primary};
  }

  /* ── Базовый ритм блоков ─────────────────────────────────────── */

  .ProseMirror > * + * {
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  .ProseMirror > *:first-child {
    margin-top: 0;
  }

  /* ── Заголовки: сдвинуты на уровень ниже (название документа живёт в шапке) ── */

  .ProseMirror h1 {
    margin-top: ${({ theme }) => theme.spacing.xl};
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.typography.headings.h2.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h2.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h2.lineHeight};
    letter-spacing: -0.03em;
    scroll-margin-top: 90px;
  }

  .ProseMirror h2 {
    margin-top: ${({ theme }) => theme.spacing.xl};
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.typography.headings.h3.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h3.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h3.lineHeight};
    scroll-margin-top: 90px;
  }

  .ProseMirror h3 {
    margin-top: ${({ theme }) => theme.spacing.lg};
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.typography.headings.h4.fontSize};
    font-weight: ${({ theme }) => theme.typography.headings.h4.fontWeight};
    line-height: ${({ theme }) => theme.typography.headings.h4.lineHeight};
    scroll-margin-top: 90px;
  }

  /* ── Текст ───────────────────────────────────────────────────── */

  .ProseMirror p {
    margin: 0;
  }

  .ProseMirror strong {
    font-weight: 700;
  }

  .ProseMirror em {
    font-style: italic;
  }

  .ProseMirror s {
    text-decoration-thickness: 1.5px;
  }

  .ProseMirror mark {
    padding: 1px 3px;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.accentSurface};
    color: inherit;
  }

  /* ── Списки ─────────────────────────────────────────────────── */

  .ProseMirror ul,
  .ProseMirror ol {
    margin: 0;
    padding-left: 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ProseMirror li::marker {
    color: ${({ theme }) => theme.colors.primary};
  }

  .ProseMirror ul p,
  .ProseMirror ol p {
    margin: 0;
  }

  /* ── Цитата ─────────────────────────────────────────────────── */

  .ProseMirror blockquote {
    margin: 0;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-left: 3px solid ${({ theme }) => theme.colors.primarySurface};
    border-radius: 0 ${({ theme }) => theme.radii.sm} ${({ theme }) => theme.radii.sm} 0;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textMuted};

    p {
      margin: 0;
    }
  }

  /* ── Инлайн-код ─────────────────────────────────────────────── */

  .ProseMirror :not(pre) > code {
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surfaceElevated};
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 0.85em;
    color: ${({ theme }) => theme.colors.accent};
  }

  /* ── Блок кода с «шапкой» из data-language ─────────────────── */

  .ProseMirror pre {
    margin: ${({ theme }) => theme.spacing.md} 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface};
    overflow: hidden;
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 13px;
    line-height: 1.7;

    &::before {
      display: block;
      padding: 8px 12px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      background: ${({ theme }) => theme.colors.surfaceElevated};
      content: attr(data-language);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &[data-language='']::before {
      content: 'code';
    }

    code {
      display: block;
      padding: ${({ theme }) => theme.spacing.md};
      overflow-x: auto;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
    }
  }

  /* ── Ссылки ─────────────────────────────────────────────────── */

  .ProseMirror a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primarySurface};
    transition: border-color ${({ theme }) => theme.transitions.fast};

    &:hover {
      border-bottom-color: ${({ theme }) => theme.colors.primary};
    }
  }

  /* ── Изображения и разделитель ─────────────────────────────── */

  .ProseMirror img {
    display: block;
    max-width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.lg};

    &.ProseMirror-selectednode {
      outline: 2px solid ${({ theme }) => theme.colors.focus};
      outline-offset: 2px;
    }
  }

  .ProseMirror hr {
    margin: ${({ theme }) => theme.spacing.lg} 0;
    border: none;
    border-top: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  }

  /* ── Таблица ────────────────────────────────────────────────── */

  .ProseMirror .tableWrapper {
    margin: ${({ theme }) => theme.spacing.md} 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow-x: auto;
  }

  .ProseMirror table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    th,
    td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      vertical-align: top;
    }

    th {
      background: ${({ theme }) => theme.colors.surfaceElevated};
      font-family: ${({ theme }) => theme.font.display};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.textMuted};
    }

    td:first-child,
    th:first-child {
      font-weight: 600;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover td {
      background: ${({ theme }) => theme.colors.surface};
    }

    .selectedCell {
      background: ${({ theme }) => theme.colors.primarySurface};
    }
  }

  /* ── Формула ────────────────────────────────────────────────── */

  .ProseMirror .th-formula {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
    border: 1px dashed ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface};
    white-space: pre-wrap;
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 17px;
    letter-spacing: 0.02em;
    color: ${({ theme }) => theme.colors.text};

    &:empty::before {
      content: '∑ …';
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }

  /* ── Плейсхолдер пустого документа (@tiptap/extensions Placeholder) ── */

  .ProseMirror > p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }

  /* ── Режим предпросмотра: курсор по умолчанию ──────────────── */

  .ProseMirror[contenteditable='false'] {
    cursor: default;
  }
`

// ─────────────────────────  Строка вставки под листом  ─────────────────────────

/** Плавающая строка «+ Блок / Медиа / Формула» — проявляется при наведении. */
export const InsertRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 34px;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover,
  &:focus-within {
    opacity: 1;
  }
`

export const InsertButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const InsertLine = styled.span`
  flex: 1;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`
