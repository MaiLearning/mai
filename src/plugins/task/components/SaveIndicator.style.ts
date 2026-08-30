import styled from 'styled-components'

/** Индикатор автосохранения: цветная точка + подпись состояния. */
export const IndicatorRoot = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Dot = styled.span<{ $tone: 'muted' | 'primary' | 'success' | 'danger' }>`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 999px;
  background: ${({ theme, $tone }) =>
    $tone === 'primary'
      ? theme.colors.primary
      : $tone === 'success'
        ? theme.colors.success
        : $tone === 'danger'
          ? theme.colors.danger
          : theme.colors.borderStrong};
`
