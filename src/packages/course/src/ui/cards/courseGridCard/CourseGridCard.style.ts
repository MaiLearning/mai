import styled from 'styled-components'

export const GridCardBody = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  min-height: 176px;
  padding: ${({ theme }) => theme.spacing.md};
`

/** Строка длительности: прижата вправо, над заголовком. */
export const GridCardDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

/** Описание курса — не больше двух строк. */
export const GridCardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/** Нижний ряд: счётчик уроков слева, статус справа. Прижат к низу карточки,
 * чтобы у всех карточек ряда строка была на одном уровне. */
export const GridCardMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

/** Кнопка перехода — на всю ширину, под метой. */
export const GridCardButton = styled.div`
  padding-top: 4px;

  & > button {
    width: 100%;
  }
`
