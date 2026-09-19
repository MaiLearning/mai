import type { ReactNode } from 'react'
import { HierarchicalList } from '../hierarchicalList'

export interface HierarchicalRenderNode {
  id: string
  children?: HierarchicalRenderNode[]
}

export function renderHierarchicalItems(
  nodes: HierarchicalRenderNode[],
  renderItem: (node: HierarchicalRenderNode) => ReactNode,
): ReactNode {
  return nodes.map((node) => (
    <HierarchicalList.Item key={node.id} value={node.id}>
      {renderItem(node)}
      {node.children && renderHierarchicalItems(node.children, renderItem)}
    </HierarchicalList.Item>
  ))
}
