import styled from 'styled-components'

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
