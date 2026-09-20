import styled from 'styled-components'
import { MainContainer } from './shared.style'

export const CoursesSection = styled(MainContainer)`
  /* Живёт внутри ContentInner шелла: горизонтальные поля и низ даёт он. */
  padding: 28px 0 0;
`

export const SectionHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.text.primary};
  }
  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: ${({ theme }) => theme.text.muted};
  }
`

/** Обёртка hero-карточки последнего курса. */
export const CourseHero = styled.div`
  margin-bottom: 20px;
`

/** Контейнер загрузки секции. */
export const CourseSectionLoading = styled.div`
  display: grid;
  place-items: center;
  padding: 48px;
`
