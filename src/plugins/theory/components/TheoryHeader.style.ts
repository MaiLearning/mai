import styled, { css } from 'styled-components'

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

/** Левая колонка шапки (breadcrumbs, название, мета) — занимает всю доступную ширину. */
export const HeaderColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
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

/** Безрамочное поле названия материала (textarea с авто-высотой): во всю ширину, с переносом строк. */
export const TitleTextarea = styled.textarea`
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  resize: none;
  overflow: hidden;
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
