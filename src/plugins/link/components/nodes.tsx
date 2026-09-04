import { type NodeProps, Position } from '@xyflow/react'
import type { GraphFlowNode } from '../core/types'
import {
  CourseCard,
  GraphHandle,
  NodeKind,
  NodeLabel,
  NodeSublabel,
  ResourceCard,
  UriCard,
} from './nodes.style'

function Handles() {
  return (
    <>
      <GraphHandle type="target" position={Position.Top} />
      <GraphHandle type="source" position={Position.Bottom} />
    </>
  )
}

/** Узел-курс: акцентная карточка, текущий курс помечается рамкой. */
export function CourseNode({ data }: NodeProps<GraphFlowNode>) {
  return (
    <CourseCard $current={data.isCurrentCourse}>
      <Handles />
      <NodeKind>{data.isCurrentCourse ? 'course' : 'course →'}</NodeKind>
      <NodeLabel>{data.label}</NodeLabel>
      {data.sublabel ? <NodeSublabel>{data.sublabel}</NodeSublabel> : null}
    </CourseCard>
  )
}

/** Узел-ресурс курса. */
export function ResourceNode({ data }: NodeProps<GraphFlowNode>) {
  return (
    <ResourceCard>
      <Handles />
      <NodeKind>resource</NodeKind>
      <NodeLabel>{data.label}</NodeLabel>
      {data.sublabel ? <NodeSublabel>{data.sublabel}</NodeSublabel> : null}
    </ResourceCard>
  )
}

/** Узел внешнего URI (сайт, файл, приложение). */
export function UriNode({ data }: NodeProps<GraphFlowNode>) {
  return (
    <UriCard>
      <Handles />
      <NodeKind>uri</NodeKind>
      <NodeLabel>{data.label}</NodeLabel>
      {data.sublabel ? <NodeSublabel>{data.sublabel}</NodeSublabel> : null}
    </UriCard>
  )
}
