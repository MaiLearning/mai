import { describe, expect, it } from 'vitest'
import { computeGuideLevels, type FlattenedItem } from './tree-utils'

function itemsOf(depths: number[]): FlattenedItem[] {
  return depths.map((depth, index) => ({
    id: `id-${index}`,
    type: 'resource',
    title: `Узел ${index}`,
    parentId: null,
    depth,
    index,
    hasChildren: false,
  }))
}

describe('computeGuideLevels', () => {
  it('пустой список — без направляющих', () => {
    expect(computeGuideLevels([])).toEqual([])
  })

  it('плоский список корневых узлов — направляющих нет', () => {
    expect(computeGuideLevels(itemsOf([0, 0, 0]))).toEqual([[], [], []])
  })

  it('структура как на скриншоте: линия уровня 1 непрерывна через поддерево Модуля 2', () => {
    // Модуль 1 → Модуль 2 → 6 ресурсов, затем ещё 4 ресурса Модуля 1.
    const levels = computeGuideLevels(itemsOf([0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1]))

    expect(levels[0]).toEqual([]) // Модуль 1: на строке папки линии нет
    expect(levels[1]).toEqual([1]) // Модуль 2: линия ур.1 в отступе своей строки
    expect(levels[2]).toEqual([1, 2]) // внутри поддерева линия ур.1 продолжается
    expect(levels[7]).toEqual([1, 2]) // последний ребёнок Модуля 2: свой уровень до низа строки
    expect(levels[8]).toEqual([1]) // следующие дети Модуля 1
    expect(levels[11]).toEqual([1]) // последний ребёнок сохраняет свой уровень
  })

  it('поддерево последнего ребёнка не продлевает линию предка', () => {
    const levels = computeGuideLevels(itemsOf([0, 1, 2, 2, 0]))

    expect(levels[0]).toEqual([])
    expect(levels[1]).toEqual([1]) // папка — последний ребёнок: только своя линия
    expect(levels[2]).toEqual([2]) // внутри поддерева линия ур.1 уже не рисуется
    expect(levels[3]).toEqual([2])
    expect(levels[4]).toEqual([])
  })

  it('свёрнутая папка пропускает линию родительского уровня сквозь себя', () => {
    const levels = computeGuideLevels(itemsOf([0, 1, 1, 0]))

    expect(levels[0]).toEqual([])
    expect(levels[1]).toEqual([1]) // линия проходит, крючка к детям нет
    expect(levels[2]).toEqual([1])
    expect(levels[3]).toEqual([])
  })

  it('глубокая вложенность: линии всех предков проходят через строку', () => {
    const levels = computeGuideLevels(itemsOf([0, 1, 2, 3, 1]))

    expect(levels[0]).toEqual([])
    expect(levels[1]).toEqual([1])
    expect(levels[2]).toEqual([1, 2])
    expect(levels[3]).toEqual([1, 3]) // линия ур.2 закончилась на строке 2
    expect(levels[4]).toEqual([1])
  })
})
