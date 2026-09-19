import type { StructureNodeFlat } from '@mai/structure'
import { describe, expect, it } from 'vitest'
import type { Link } from '../../entity'
import { buildGraph } from './graph'

const courseId = 'course-1'

function link(
  partial: Partial<Link> & Pick<Link, 'id' | 'sourceType' | 'sourceId' | 'target'>,
): Link {
  return {
    ownerPluginId: 'internal-link',
    title: null,
    description: null,
    targetStatus: 'ok',
    createdAt: 0,
    updatedAt: 0,
    ...partial,
  }
}

function structure(id: string, name: string): StructureNodeFlat {
  return {
    id,
    courseId,
    parentId: null,
    position: 0,
    isDirectory: false,
    directoryId: null,
    name,
    resource: {
      id,
      courseId,
      typeKey: 'theory',
      name,
      metadata: null,
      files: [],
      createdAt: 0,
      updatedAt: 0,
    },
  }
}

describe('buildGraph', () => {
  it('собирает узлы ресурс-ресурс и считает степени', () => {
    const { nodes, edges } = buildGraph({
      courseId,
      links: [
        link({
          id: 'l1',
          sourceType: 'resource',
          sourceId: 'r1',
          target: { kind: 'resource', courseId, resourceId: 'r2' },
        }),
        link({
          id: 'l2',
          sourceType: 'resource',
          sourceId: 'r1',
          target: { kind: 'resource', courseId, resourceId: 'r2' },
        }),
      ],
      structureNodes: [structure('r1', 'Первый'), structure('r2', 'Второй')],
      courseNames: { [courseId]: 'Курс' },
    })

    expect(edges).toHaveLength(2)
    const byId = new Map(nodes.map((node) => [node.id, node]))
    expect(byId.get('resource:r1')?.degree).toBe(2)
    expect(byId.get('resource:r2')?.degree).toBe(2)
    expect(byId.get('resource:r1')?.label).toBe('Первый')
  })

  it('URI-цель даёт узел uri, курс-цель — узел course', () => {
    const { nodes } = buildGraph({
      courseId,
      links: [
        link({
          id: 'l1',
          sourceType: 'course',
          sourceId: courseId,
          target: { kind: 'uri', uri: 'https://example.com' },
        }),
        link({
          id: 'l2',
          sourceType: 'course',
          sourceId: courseId,
          target: { kind: 'course', courseId: 'course-2' },
        }),
      ],
      structureNodes: [],
      courseNames: { [courseId]: 'Курс', 'course-2': 'Другой' },
    })

    const kinds = new Map(nodes.map((node) => [node.id, node.kind]))
    expect(kinds.get('uri:https://example.com')).toBe('uri')
    expect(kinds.get('course:course-2')).toBe('course')
    // текущий курс помечен
    expect(nodes.find((node) => node.id === 'course:course-1')?.isCurrentCourse).toBe(true)
    expect(nodes.find((node) => node.id === 'course:course-2')?.isCurrentCourse).toBe(false)
  })

  it('без рёбер — единственный узел текущего курса', () => {
    const { nodes, edges } = buildGraph({
      courseId,
      links: [],
      structureNodes: [structure('r1', 'Первый')],
      courseNames: { [courseId]: 'Курс' },
    })

    expect(edges).toHaveLength(0)
    expect(nodes).toHaveLength(1)
    expect(nodes[0]).toMatchObject({ kind: 'course', nodeId: courseId, degree: 0 })
  })
})
