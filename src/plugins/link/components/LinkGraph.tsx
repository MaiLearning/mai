import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeMouseHandler,
  type NodeMouseHandler,
  ReactFlow,
} from '@xyflow/react'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import type { Link } from '@/entities/link'
import type { GraphFlowEdge, GraphFlowNode, GraphNodeData } from '../core/types'
import { CourseNode, ResourceNode, UriNode } from './nodes'

const nodeTypes = { course: CourseNode, resource: ResourceNode, uri: UriNode }

export interface LinkGraphProps {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
  onNodeActivate: (data: GraphNodeData) => void
  onEdgeSelect: (link: Link) => void
}

/**
 * Холст графа на @xyflow/react: кастомные узлы, стили рёбер по теме,
 * битые цели — пунктиром danger-цвета.
 */
export function LinkGraph({ nodes, edges, onNodeActivate, onEdgeSelect }: LinkGraphProps) {
  const theme = useTheme()

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        const broken = edge.data?.link.targetStatus === 'broken'

        return {
          ...edge,
          animated: broken,
          style: {
            stroke: broken ? theme.colors.danger : theme.colors.borderStrong,
            strokeWidth: 1.6,
            strokeDasharray: broken ? '6 4' : undefined,
          },
          labelStyle: {
            fill: theme.colors.textMuted,
            fontSize: 11,
            fontWeight: 500,
          },
          labelBgStyle: { fill: theme.colors.surface },
        }
      }),
    [edges, theme],
  )

  const handleNodeClick: NodeMouseHandler<GraphFlowNode> = (_event, node) => {
    onNodeActivate(node.data)
  }
  const handleEdgeClick: EdgeMouseHandler<GraphFlowEdge> = (_event, edge) => {
    const link = edge.data?.link
    if (link) onEdgeSelect(link)
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={styledEdges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      fitView
      fitViewOptions={{ padding: 0.25 }}
      minZoom={0.15}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
