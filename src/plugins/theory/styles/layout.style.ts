import styled, { css } from 'styled-components'

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

// ─────────────────────────  Header  ─────────────────────────

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.body};
`

export const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`

export const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    opacity: 0.45;
    flex: none;
  }
`

export const Crumb = styled.span<{ $current?: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ $current, theme }) =>
    $current &&
    css`
      color: ${theme.colors.primary};
      font-weight: 600;
    `}
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`

/** Безрамочное поле названия материала в стиле заголовка страницы. */
export const TitleInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: ${({ theme }) => theme.typography.headings.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.headings.h2.fontWeight};
  line-height: ${({ theme }) => theme.typography.headings.h2.lineHeight};
  letter-spacing: -0.03em;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
  }
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  svg {
    opacity: 0.6;
  }
`

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.borderStrong};
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

// ─────────────────────────  Status bar  ─────────────────────────

export const StatusBar = styled.footer`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  height: 34px;
  flex: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11px;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const StatusItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

/**
 * Элемент автосохранения: ширина зарезервирована под самый длинный лейбл
 * («Автосохранение включено»), чтобы соседние элементы не смещались
 * при смене статуса. Шрифт монospace — ширина в ch детерминирована.
 */
export const StatusAutosave = styled(StatusItem)`
  min-width: 25ch;
`

export const StatusSpacer = styled.span`
  flex: 1;
`

/** Индикатор автосохранения: success — сохранено/включено, warning — сохранение, danger — ошибка. */
export const SaveDot = styled.span<{ $tone: 'success' | 'warning' | 'danger' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $tone }) =>
    $tone === 'warning'
      ? theme.colors.warning
      : $tone === 'danger'
        ? theme.colors.danger
        : theme.colors.success};
`
