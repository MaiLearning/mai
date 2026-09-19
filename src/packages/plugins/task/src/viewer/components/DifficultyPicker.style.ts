import styled from 'styled-components'

/** Строка своей сложности: кнопка выбора + действия (изменить/удалить). */
export const MenuRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $active, theme }) => ($active ? theme.background.surface : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme.background.surface};
  }
`

/** Основная зона строки: выбор сложности. */
export const RowButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 9px 10px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
`

/** Иконки-действия своей сложности. */
export const RowActions = styled.div`
  display: flex;
  gap: 2px;
  padding-right: 6px;
`

export const ActionButton = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme, $danger }) => ($danger ? theme.status.danger.foreground : theme.text.primary)};
    background: ${({ theme, $danger }) =>
      $danger ? theme.status.danger.background : theme.background.elevated};
  }
`
