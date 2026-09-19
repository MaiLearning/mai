import { describe, expect, it } from 'vitest'
import {
  EDGE_ZONE,
  findNodeTitle,
  isDescendant,
  ROOT_DROP_ID,
  ROOT_ZONE_ID,
  resolveDropTarget,
} from './dnd'
import type { CourseNode } from './types'

const tree: CourseNode[] = [
  {
    id: 'folder-a',
    type: 'folder',
    title: 'A',
    children: [
      { id: 'res-a1', type: 'resource', title: 'A1' },
      { id: 'res-a2', type: 'resource', title: 'A2' },
    ],
  },
  { id: 'res-top1', type: 'resource', title: 'T1' },
  {
    id: 'folder-b',
    type: 'folder',
    title: 'B',
    children: [
      {
        id: 'folder-b1',
        type: 'folder',
        title: 'B1',
        children: [{ id: 'res-deep', type: 'resource', title: 'Deep' }],
      },
      { id: 'res-b2', type: 'resource', title: 'B2' },
    ],
  },
  { id: 'res-top2', type: 'resource', title: 'T2' },
  { id: 'folder-empty', type: 'folder', title: 'Empty', children: [] },
]

const resolve = (dragId: string, overId: string | null, ratioY: number) =>
  resolveDropTarget({ nodes: tree, dragId, overId, ratioY })

describe('resolveDropTarget', () => {
  it('середина папки — внутрь, append в конец детей', () => {
    expect(resolve('res-top1', 'folder-a', 0.5)).toEqual({
      kind: 'inside',
      parentId: 'folder-a',
      position: 2,
      targetId: 'folder-a',
    })
  })

  it('внутрь своей папки — append без учёта самого узла', () => {
    expect(resolve('res-a1', 'folder-a', 0.5)?.position).toBe(1)
  })

  it('середина пустой папки — внутрь, позиция 0', () => {
    expect(resolve('res-top1', 'folder-empty', 0.5)).toEqual({
      kind: 'inside',
      parentId: 'folder-empty',
      position: 0,
      targetId: 'folder-empty',
    })
  })

  it('середина ресурса — после него', () => {
    expect(resolve('folder-a', 'res-top1', 0.5)).toEqual({
      kind: 'after',
      parentId: null,
      position: 1,
      targetId: 'res-top1',
    })
  })

  it('верхний край строки — вставка перед (чужой родитель)', () => {
    expect(resolve('res-top2', 'res-top1', 0.1)).toEqual({
      kind: 'before',
      parentId: null,
      position: 1,
      targetId: 'res-top1',
    })
  })

  it('нижний край строки — вставка после (чужой родитель)', () => {
    expect(resolve('res-top2', 'res-top1', 0.9)).toEqual({
      kind: 'after',
      parentId: null,
      position: 2,
      targetId: 'res-top1',
    })
  })

  it('перемещение вниз в пределах одного родителя — поправка remove-first', () => {
    // res-top1 (индекс 1) после res-top2 (индекс 3): после удаления res-top1 цель смещается на 2.
    expect(resolve('res-top1', 'res-top2', 0.9)).toEqual({
      kind: 'after',
      parentId: null,
      position: 3,
      targetId: 'res-top2',
    })
    expect(resolve('res-top1', 'res-top2', 0.1)?.position).toBe(2)
  })

  it('границы зон: ровно EDGE_ZONE — середина, чуть выше — before', () => {
    expect(resolve('res-top1', 'folder-a', EDGE_ZONE)?.kind).toBe('inside')
    expect(resolve('res-top1', 'folder-a', EDGE_ZONE - 0.01)?.kind).toBe('before')
    expect(resolve('res-top1', 'folder-a', 1 - EDGE_ZONE)?.kind).toBe('inside')
    expect(resolve('res-top1', 'folder-a', 1 - EDGE_ZONE + 0.01)?.kind).toBe('after')
  })

  it('ratio зажимается в [0, 1]', () => {
    expect(resolve('res-top2', 'res-top1', -5)?.kind).toBe('before')
    expect(resolve('res-top2', 'res-top1', 5)?.kind).toBe('after')
  })

  it('в собственного потомка — null', () => {
    expect(resolve('folder-b', 'folder-b1', 0.5)).toBeNull()
    expect(resolve('folder-b', 'res-deep', 0.9)).toBeNull()
  })

  it('на свою строку — null', () => {
    expect(resolve('res-top1', 'res-top1', 0.5)).toBeNull()
  })

  it('неизвестная цель — null', () => {
    expect(resolve('res-top1', 'missing', 0.5)).toBeNull()
  })

  it('дроп мимо строк — append в корень без учёта перетаскиваемого', () => {
    expect(resolve('res-top1', ROOT_DROP_ID, 0.5)).toEqual({
      kind: 'inside',
      parentId: null,
      position: 4,
      targetId: null,
    })
  })

  it('нижняя зона «в корень» — тот же append в корень', () => {
    expect(resolve('folder-a', ROOT_ZONE_ID, 0.5)).toEqual({
      kind: 'inside',
      parentId: null,
      position: 4,
      targetId: null,
    })
  })
})

describe('isDescendant', () => {
  it('потомок находится', () => {
    expect(isDescendant(tree, 'folder-b', 'res-deep')).toBe(true)
    expect(isDescendant(tree, 'folder-b', 'folder-b1')).toBe(true)
  })

  it('узел вне поддерева и сам узел — не потомки', () => {
    expect(isDescendant(tree, 'folder-b', 'res-a1')).toBe(false)
    expect(isDescendant(tree, 'folder-b', 'folder-b')).toBe(false)
  })
})

describe('findNodeTitle', () => {
  it('находит заголовок на любой глубине', () => {
    expect(findNodeTitle(tree, 'folder-b1')).toBe('B1')
    expect(findNodeTitle(tree, 'res-deep')).toBe('Deep')
  })

  it('неизвестный id — null', () => {
    expect(findNodeTitle(tree, 'nope')).toBeNull()
  })
})
