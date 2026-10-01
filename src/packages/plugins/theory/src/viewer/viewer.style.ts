import { themedScrollbar } from '@mai/theme'
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
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

// ─────────────────────────  Layout: Canvas  ─────────────────────────

export const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
`

/** Обёртка рабочей области: держит относительное позиционирование для оверлея загрузки. */
export const CanvasWrap = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
`

/** Прокручиваемая рабочая область с листом документа по центру. */
export const Canvas = styled.div`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};

  ${themedScrollbar}
`

/** Оверлей загрузки контента: закрывает документ, пока идёт загрузка с backend. */
export const LoadOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};

  &:focus,
  .ProseMirror:focus {
    outline: none;
  }

  .ProseMirror {
    caret-color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
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
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.sizes.xl};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    letter-spacing: -0.03em;
    scroll-margin-top: 90px;
  }

  .ProseMirror h2 {
    margin-top: ${({ theme }) => theme.spacing.xl};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    scroll-margin-top: 90px;
  }

  .ProseMirror h3 {
    margin-top: ${({ theme }) => theme.spacing.lg};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.sizes.md};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
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
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
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
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  }

  .ProseMirror ul p,
  .ProseMirror ol p {
    margin: 0;
  }

  /* ── Цитата ─────────────────────────────────────────────────── */

  .ProseMirror blockquote {
    margin: 0;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-left: 3px solid ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
    border-radius: 0 ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0;
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};

    p {
      margin: 0;
    }
  }

  /* ── Инлайн-код ─────────────────────────────────────────────── */

  .ProseMirror :not(pre) > code {
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 0.85em;
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  }
  /* ── Блок кода с «шапкой» из data-language ─────────────────── */

  .ProseMirror pre {
    margin: ${({ theme }) => theme.spacing.md} 0;
    border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-radius: ${({ theme }) => theme.radius.lg};
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
    overflow: hidden;
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 13px;
    line-height: 1.7;

    &::before {
      display: block;
      padding: 8px 12px;
      border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
      background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
      content: attr(data-language);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
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
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    text-decoration: none;
    border-bottom: 1px solid ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
    transition: border-color ${({ theme }) => theme.durations.fast};

    &:hover {
      border-bottom-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    }
  }

  /* ── Изображения и разделитель ─────────────────────────────── */

  .ProseMirror img {
    display: block;
    max-width: 100%;
    border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-radius: ${({ theme }) => theme.radius.lg};

    &.ProseMirror-selectednode {
      outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
      outline-offset: 2px;
    }
  }

  .ProseMirror hr {
    margin: ${({ theme }) => theme.spacing.lg} 0;
    border: none;
    border-top: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  }

  /* ── Таблица ────────────────────────────────────────────────── */

  .ProseMirror .tableWrapper {
    margin: ${({ theme }) => theme.spacing.md} 0;
    border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-radius: ${({ theme }) => theme.radius.lg};
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
      border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
      vertical-align: top;
    }

    th {
      background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
      font-family: ${({ theme }) => theme.typography.fontFamily};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    }

    td:first-child,
    th:first-child {
      font-weight: 600;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover td {
      background: ${({ theme }) =>
        theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    }

    .selectedCell {
      background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
    }
  }

  /* ── Формула ────────────────────────────────────────────────── */

  .ProseMirror .th-formula {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
    border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-radius: ${({ theme }) => theme.radius.lg};
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
    white-space: pre-wrap;
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 17px;
    letter-spacing: 0.02em;
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};

    &:empty::before {
      content: '∑ …';
      color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    }
  }

  /* ── Плейсхолдер пустого документа (@tiptap/extensions Placeholder) ── */

  .ProseMirror > p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    opacity: 0.7;
  }

  /* ── Режим предпросмотра: курсор по умолчанию ──────────────── */

  .ProseMirror[contenteditable='false'] {
    cursor: default;
  }
`

// ─────────────────────────  Строка вставки под листом  ─────────────────────────

/**
 * Строка «+ Блок / Медиа / Формула» под листом. Постоянно слегка видима,
 * чтобы быть обнаруживаемой; при наведении проявляется полностью.
 */
export const InsertRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 34px;
  opacity: 0.55;
  transition: opacity ${({ theme }) => theme.durations.fast};

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
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-style: solid;
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  }
`

export const InsertLine = styled.span`
  flex: 1;
  height: 1px;
  background: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`
