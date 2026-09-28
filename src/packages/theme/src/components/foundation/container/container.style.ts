import styled from 'styled-components'
import { BoxRoot } from '../box/box.style'
import type { ContainerSize } from './container'

export interface ContainerRootProps {
  $size: ContainerSize
  $fluid: boolean
}

/**
 * Поля области в базовых шагах (`theme.spacing.step`): 8 = 1rem,
 * 12 = 1.5rem, 24 = 3rem.
 *
 * Лестница живёт здесь, а не в теме: потребитель у неё один. Второй
 * компонент с такими же полями — повод поднять её в `theme.layout`.
 */
const gutterSteps = { base: 8, sm: 12, md: 24 } as const

/**
 * Пороги лестницы: ширина контейнера, на которой поле растёт.
 * Контейнерные запросы, а не медиа: считаются от ширины самой области.
 */
const gutterWidths = { sm: '35rem', md: '64rem' } as const

/**
 * Внешний слой `Container`: потолок ширины из шкалы
 * `layout.containerWidths` и центрирование по горизонтали. Полей на нём
 * быть не должно — иначе ширина контейнера станет зависеть от результата
 * его же контейрного запроса.
 *
 * Здесь же объявляется контейнер запросов: внутренний слой растит поля
 * по ширине этого блока, а потомки могут спрашивать его как `container`
 * вместо того, чтобы заводить своё имя.
 */
export const ContainerRoot = styled(BoxRoot)<ContainerRootProps>`
  width: 100%;
  max-width: ${({ theme, $size, $fluid }) =>
    $fluid ? 'none' : theme.layout.containerWidths[$size]};
  margin-inline: auto;
  container-type: inline-size;
  container-name: container;
`

/**
 * Внутренний слой `Container`: горизонтальные поля, растущие по мере
 * расширения контейнера (1rem → 1.5rem → 3rem). Значения — шаги базового
 * отступа темы, поэтому правило прописано один раз здесь, а не
 * размазывается по страницам.
 */
export const ContainerInner = styled(BoxRoot)`
  width: 100%;
  padding-inline: ${({ theme }) => theme.utils.space(gutterSteps.base)};

  @container (min-width: ${gutterWidths.sm}) {
    padding-inline: ${({ theme }) => theme.utils.space(gutterSteps.sm)};
  }

  @container (min-width: ${gutterWidths.md}) {
    padding-inline: ${({ theme }) => theme.utils.space(gutterSteps.md)};
  }
`
