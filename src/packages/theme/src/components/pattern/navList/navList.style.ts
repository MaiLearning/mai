import styled, { css } from 'styled-components'

/** Корень навигации: вертикальный список групп. */
export const NavListRoot = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

/** Группа навигации (заголовок + список пунктов). */
export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

/** Заголовок группы над пунктами. */
export const GroupTitle = styled.h3`
  margin: 0;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

/** Список пунктов группы. */
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

/** Вложенный список подпунктов. */
export const NestedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
`

export interface ItemProps {
  $active: boolean
  $disabled: boolean
}

/** Пункт навигации: иконка + подпись, состояния hover/active/disabled. */
export const Item = styled.button<ItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  min-width: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.utils.withState(theme.utils.getText('neutral', 'primary'), 'disabledAlpha')
      : theme.utils.getText('neutral', 'primary')};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  text-align: left;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }

  ${({ $active, $disabled, theme }) =>
    $active &&
    !$disabled &&
    css`
      background: ${theme.utils.getBackground('accent', 'surface')};
      color: ${theme.utils.getText('accent', 'primary')};

      &:hover:not(:disabled) {
        background: ${theme.utils.getBackground('accent', 'surface')};
      }
    `}
`

/** Слот иконки пункта. */
export const ItemIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
`

/** Подпись пункта — обрезается по ширине. */
export const ItemLabel = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

/** Дополнительный контент справа от подписи. */
export const ItemAside = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
`
