import styled from 'styled-components'
import type { SpacingValue } from '../../../base/utils'
import { BoxRoot } from '../box/box.style'
import type { GridAlign, GridColumns, GridJustify } from './grid'

export interface GridRootProps {
  $columns?: GridColumns
  $min?: string
  $gap?: SpacingValue
  $align?: GridAlign
  $justify?: GridJustify
}

/**
 * Собирает `grid-template-columns` из пропсов.
 *
 * `min` побеждает `columns`: упаковка по минимальной ширине трека — более
 * конкретное намерение, и в разметке эти два пропса вместе не встречаются.
 * `auto-fit` схлопывает пустые треки, поэтому одна карточка растягивается
 * на всю ширину; если потребителю нужна жёсткая сетка, берётся `columns`.
 *
 * Нецелое или неположительное число колонок отбрасывается: `repeat(0, 1fr)`
 * — невалидное значение, браузер молча выбросил бы всё объявление, и
 * компонент отдал пустую сетку без диагностики.
 */
export function resolveColumns(columns: GridColumns | undefined, min: string | undefined) {
  if (min !== undefined) return `repeat(auto-fit, minmax(${min}, 1fr))`
  if (columns === undefined) return undefined
  if (typeof columns === 'number') {
    return Number.isInteger(columns) && columns > 0 ? `repeat(${columns}, 1fr)` : undefined
  }

  return columns
}

/**
 * Корень `Grid` — колоночная раскладка, специализация `Box`.
 *
 * Ровно четыре обязанности: колоночная сетка, шаблон треков, зазор и
 * выравнивание элементов внутри треков. Нормализованная блочная модель
 * наследуется от `BoxRoot`, поэтому `1fr`-треки не разъезжаются на длинном
 * содержимом — ради этого `min-width: 0` и нужен.
 *
 * Ось одна: `gap` в гриде сразу ставит и зазор между строками, и зазор между
 * колонками, отдельного пропса под разные значения нет.
 */
export const GridRoot = styled(BoxRoot)<GridRootProps>`
  display: grid;
  ${({ $columns, $min }) => {
    const template = resolveColumns($columns, $min)

    return template && `grid-template-columns: ${template};`
  }}
  align-items: ${({ $align }) => $align ?? 'stretch'};
  justify-items: ${({ $justify }) => $justify ?? 'stretch'};
  ${({ theme, $gap }) => $gap !== undefined && `gap: ${theme.utils.space($gap)};`}
`
