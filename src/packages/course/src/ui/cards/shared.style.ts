import { Card } from '@mai/theme'
import styled from 'styled-components'

/** Контейнер секции: центрирование и боковые отступы. */
export const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
`

/**
 * Корень карточки курса. Объявлен контейнером: внутренние блоки карточки
 * (обложка, футер hero) адаптируются по её ширине, а не по вьюпорту.
 */
export const CourseCardRoot = styled(Card)`
  container-type: inline-size;
  container-name: course-card;
`
