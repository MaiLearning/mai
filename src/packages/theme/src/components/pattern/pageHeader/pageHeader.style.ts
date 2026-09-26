import styled from 'styled-components'

/** Шапка раздела: контент и верхний слот с действиями. */
export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

/** Верхний ряд: текстовый блок слева, действия справа. */
export const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`

/** Текстовый блок: крошки, заголовок, описание. */
export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

/** Правый слот шапки: поиск, действия. */
export const Aside = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 0 0 auto;
  min-width: 0;
`
