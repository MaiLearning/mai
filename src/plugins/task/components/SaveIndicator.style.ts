import styled from 'styled-components'

/** Индикатор автосохранения: цветная точка + подпись состояния. */
export const IndicatorRoot = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 0.8125rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`

/** Подпись состояния: на узком вьюере скрывается, остаётся только точка. */
export const Label = styled.span`
  @container task-viewer (max-width: 479px) {
    display: none;
  }
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
