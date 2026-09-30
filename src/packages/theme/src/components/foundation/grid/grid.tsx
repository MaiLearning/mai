import type { ComponentPropsWithoutRef } from 'react'
import type { SpacingKey } from '../../../base/theme'
import { GridRoot } from './grid.style'

/** Выравнивание элементов внутри своих треков по поперечной оси (`align-items`). */
export type GridAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline'

/**
 * Выравнивание элементов внутри своих треков по главной оси
 * (`justify-items`).
 *
 * ВНИМАНИЕ: множество значений не пересекается с `Flex`. У `Flex` `justify`
 * это `justify-content` (`flex-start … space-evenly`), а здесь — выравнивание
 * элемента в его треке; распределение треков по главной оси в гриде
 * выражается другим свойством, и в этом API оно не вынесено.
 */
export type GridJustify = 'start' | 'end' | 'center' | 'stretch'

/**
 * Шаблон колонок: число равных колонок (`3` → `repeat(3, 1fr)`) либо готовый
 * шаблон треков дословно (`'1fr auto 1fr auto'`, `'18px 1fr auto'`).
 *
 * Строка — сознательный побег: колонки бывают неравными, и описывать их
 * прочими пропсами значило бы изобретать язык размеров треков. Число колонок
 * при этом остаётся числом, а не токеном: это количество, а не длина.
 */
export type GridColumns = number | string

export interface GridProps extends Omit<ComponentPropsWithoutRef<'div'>, 'align'> {
  /**
   * Число равных колонок или готовый шаблон треков. Потолок колонок при этом
   * фиксирован: на широкой области сетка не уплотняется.
   */
  columns?: GridColumns
  /**
   * Минимальная ширина трека: колонок столько, сколько влезет в ширину
   * контейнера (`repeat(auto-fit, minmax(min, 1fr))`). Число колонок сверху не
   * ограничено — если потолок нужен, задавайте `columns`. Побеждает `columns`,
   * если переданы оба.
   */
  min?: string
  /** Зазор между строками и колонками: ключ каталога `theme.spacing` или число базовых шагов. */
  gap?: SpacingKey | number
  /** Выравнивание элементов по поперечной оси внутри треков. */
  align?: GridAlign
  /** Выравнивание элементов по главной оси внутри треков. */
  justify?: GridJustify
  /** Семантический тег корня. */
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer' | 'aside' | 'nav'
}

/**
 * Колоночная раскладка — специализация `Box`.
 *
 * Нужна там, где элементы должны попадать в общие колонки, а не просто
 * стоять рядом: заголовок на несколько колонок, панель на несколько строк,
 * карточки одинаковой ширины в каталоге. Одномерные раскладки — это
 * `Flex` и `Stack`, у них элементы выравниваются только в пределах своей
 * строки.
 *
 * Число колонок, зазор и выравнивание — единственная ответственность.
 * Области по именам, явное размещение элементов и потолок адаптивного числа
 * колонок в API не вынесены: в репозитории нет ни одного их потребителя.
 */
export function Grid({ columns, min, gap, align, justify, as, children, ...divProps }: GridProps) {
  return (
    <GridRoot
      $columns={columns}
      $min={min}
      $gap={gap}
      $align={align}
      $justify={justify}
      as={as}
      {...divProps}
    >
      {children}
    </GridRoot>
  )
}
