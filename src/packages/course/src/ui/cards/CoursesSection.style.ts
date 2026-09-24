import styled from 'styled-components'
import { MainContainer } from './shared.style'

export const CoursesSection = styled(MainContainer)`
  /* Живёт внутри ContentInner шелла: горизонтальные поля и низ даёт он. */
  padding: 28px 0 0;
`

/** Блок заголовка секции: подпись и пояснение. */
export const SectionTitles = styled.div`
  display: grid;
  gap: 4px;
`

export const SectionHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
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
