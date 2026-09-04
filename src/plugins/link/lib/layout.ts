import ELK from 'elkjs/lib/elk.bundled.js'
import { NODE_HEIGHT, NODE_WIDTH } from '../core/constants'
import type { GraphFlowEdge, GraphFlowNode } from '../core/types'

/**
 * Раскладка графа силовым алгоритмом ELK (force).
 * Возвращает узлы с проставленными позициями.
 */
export async function applyLayout(
  nodes: GraphFlowNode[],
  edges: GraphFlowEdge[],
): Promise<GraphFlowNode[]> {
  if (nodes.length === 0) return nodes

  const elk = new ELK()
  const layouted = await elk.layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'org.eclipse.elk.force',
      'elk.force.repulsion': '280',
      'elk.spacing.nodeNode': '80',
      'org.eclipse.elk.randomSeed': '1',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  })

  const positions = new Map(
    (layouted.children ?? []).map((child) => [child.id, { x: child.x ?? 0, y: child.y ?? 0 }]),
  )

  return nodes.map((node) => ({ ...node, position: positions.get(node.id) ?? node.position }))
}
