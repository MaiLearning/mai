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

  it('линия уровня длится через поддеревья вложенных папок до последней строки', () => {
    // Модуль 1 → Модуль 2 → 6 ресурсов, затем ещё 4 ресурса Модуля 1.
    const levels = computeGuideLevels(itemsOf([0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1]))

    expect(levels[0]).toEqual([]) // Модуль 1: на строке папки линии нет
    expect(levels[1]).toEqual([{ level: 1, end: false }]) // Модуль 2: линия ур.1 в отступе
    expect(levels[2]).toEqual([
      { level: 1, end: false },
      { level: 2, end: false },
    ]) // внутри поддерева линия ур.1 продолжается
    expect(levels[7]).toEqual([
      { level: 1, end: false },
      { level: 2, end: true },
    ]) // последний ребёнок Модуля 2: его линия закругляется вправо
    expect(levels[8]).toEqual([{ level: 1, end: false }]) // следующие дети Модуля 1
    expect(levels[11]).toEqual([{ level: 1, end: true }]) // последняя строка: конец линии ур.1
  })

  it('на последней строке поддерева уголок только у самой внутренней линии', () => {
    const levels = computeGuideLevels(itemsOf([0, 1, 2, 2, 0]))

    expect(levels[0]).toEqual([])
    expect(levels[1]).toEqual([{ level: 1, end: false }])
    expect(levels[2]).toEqual([
      { level: 1, end: false },
      { level: 2, end: false },
    ])
    expect(levels[3]).toEqual([
      { level: 1, end: false },
      { level: 2, end: true },
    ]) // обе линии закончились здесь, но поворот — только у внутренней
    expect(levels[4]).toEqual([])
  })

  it('последний ребёнок получает уголок, промежуточные — прямую линию', () => {
    const levels = computeGuideLevels(itemsOf([0, 1, 1, 0]))

    expect(levels[0]).toEqual([])
    expect(levels[1]).toEqual([{ level: 1, end: false }])
    expect(levels[2]).toEqual([{ level: 1, end: true }]) // последний ребёнок — уголок
    expect(levels[3]).toEqual([])
  })

  it('глубокая вложенность: линии всех предков проходят через строку', () => {
    const levels = computeGuideLevels(itemsOf([0, 1, 2, 3, 1]))

    expect(levels[0]).toEqual([])
    expect(levels[1]).toEqual([{ level: 1, end: false }])
    expect(levels[2]).toEqual([
      { level: 1, end: false },
      { level: 2, end: false },
    ])
    expect(levels[3]).toEqual([
      { level: 1, end: false },
      { level: 2, end: false },
      { level: 3, end: true },
    ]) // линии ур.2 и ур.3 закончились здесь — поворот у внутренней (ур.3)
    expect(levels[4]).toEqual([{ level: 1, end: true }])
  })
})
