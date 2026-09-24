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
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11px;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
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

/** Кнопка повторной попытки сохранения — видна только при ошибке. */
export const StatusRetry = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: ${({ theme }) => theme.spacing.sm};
  padding: 2px 8px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-family: inherit;
  font-size: 11px;
  letter-spacing: inherit;
  cursor: pointer;
  transition: color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  }
`

/** Индикатор автосохранения: success — сохранено/включено, warning — сохранение, danger — ошибка. */
export const SaveDot = styled.span<{ $tone: 'success' | 'warning' | 'danger' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $tone }) =>
    $tone === 'warning'
      ? theme.utils.getText('warning', 'primary')
      : $tone === 'danger'
        ? theme.utils.getText('danger', 'primary')
        : theme.utils.getText('success', 'primary')};
`
