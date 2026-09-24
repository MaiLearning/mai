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
  border: 1px solid ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  font-size: 0.95em;
  line-height: 1.6;
  cursor: pointer;
  vertical-align: baseline;
  transition:
    background-color 120ms ease,
    border-color 120ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 1px;
  }

  ${({ theme, $broken }) =>
    $broken &&
    css`
      border: 1px dashed ${theme.utils.getBorder('neutral', 'default')};
      background: transparent;
      color: ${theme.utils.getText('danger', 'primary')};
      cursor: not-allowed;
    `}
`

/** Иконка материала внутри чипа. */
export const WikiChipIcon = styled(FileText)`
  flex: none;
  opacity: 0.8;
`
