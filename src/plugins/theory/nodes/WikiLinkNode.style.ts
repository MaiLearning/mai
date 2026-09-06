import { FileText } from 'lucide-react'
import styled, { css } from 'styled-components'

// ─────────────────────────  WikiLink  ─────────────────────────

/** Чип wiki-ссылки: мягкий акцентный фон; broken — приглушённый с пунктиром. */
export const WikiChip = styled.span<{ $broken?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 1px 8px;
  margin: 0 1px;
  border: 1px solid ${({ theme }) => theme.colors.accentSurface};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.accentSurface};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.95em;
  line-height: 1.6;
  cursor: pointer;
  vertical-align: baseline;
  transition:
    background-color 120ms ease,
    border-color 120ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 1px;
  }

  ${({ theme, $broken }) =>
    $broken &&
    css`
      border: 1px dashed ${theme.colors.border};
      background: transparent;
      color: ${theme.colors.danger};
      cursor: not-allowed;
    `}
`

/** Иконка материала внутри чипа. */
export const WikiChipIcon = styled(FileText)`
  flex: none;
  opacity: 0.8;
`
