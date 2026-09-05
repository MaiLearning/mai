import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
} from 'd3-force'
import {
  ALPHA_DATA,
  ALPHA_DECAY,
  ALPHA_DRAG,
  ALPHA_MIN,
  ALPHA_PARAMS,
  VELOCITY_DECAY,
} from '../core/constants'
import type { GraphEdge, GraphNode, PhysicsParams } from '../core/types'

/** Узел симуляции: доменный узел + координаты/скорости d3-force. */
export type SimNode = GraphNode & SimulationNodeDatum

/**
 * Ребро симуляции с разрешёнными ссылками на узлы.
 * d3 мутирует source/target при инициализации forceLink, поэтому держим
 * свои жёсткие типы (у SimulationLinkDatum они — union с id).
 */
export type SimLink = {
  id: string
  broken: boolean
  source: SimNode
  target: SimNode
}

/** Обёртка над d3-force: тики гоняет rAF-цикл, не внутренний таймер d3. */
export type GraphSimulation = {
  nodes: SimNode[]
  links: SimLink[]
  /** Один шаг физики. */
  tick(): void
  /** Текущая альфа — «температура» симуляции. */
  alpha(): number
  /** Заменяет данные, сохраняя позиции узлов по id; новые узлы появляются у центра. */
  setData(nodes: GraphNode[], edges: GraphEdge[]): void
  /** Обновляет параметры физики и мягко перегревает граф. */
  setParams(params: PhysicsParams): void
  /** Разогрев: alpha = max(alpha, level). */
  reheat(level?: number): void
  /** Перетаскивание узла держит симуляцию горячей. */
  setDragging(active: boolean): void
}

/** Сила связи: крепче для узлов с малой степенью (висячие концы подтягиваются). */
function linkStrength(link: SimLink): number {
  return 1 / Math.max(1, Math.min(link.source.degree, link.target.degree))
}

export function createSimulation(initial: PhysicsParams): GraphSimulation {
  let params: PhysicsParams = { ...initial }
  let sim = buildSim([], [], params)
  let nodes: SimNode[] = []
  let links: SimLink[] = []

  function buildSim(
    nextNodes: SimNode[],
    nextLinks: SimLink[],
    p: PhysicsParams,
  ): Simulation<SimNode, SimLink> {
    return forceSimulation<SimNode>(nextNodes)
      .force('charge', forceManyBody<SimNode>().strength(-p.repulsion))
      .force(
        'link',
        forceLink<SimNode, SimLink>(nextLinks)
          .id((node) => node.id)
          .distance(p.linkDistance)
          .strength(linkStrength),
      )
      .force('x', forceX<SimNode>(0).strength(p.centerStrength))
      .force('y', forceY<SimNode>(0).strength(p.centerStrength))
      .velocityDecay(VELOCITY_DECAY)
      .alphaDecay(ALPHA_DECAY)
      .alphaMin(ALPHA_MIN)
      .stop()
  }

  function configure(p: PhysicsParams): void {
    ;(sim.force('charge') as ReturnType<typeof forceManyBody<SimNode>>).strength(-p.repulsion)
    const linkForce = sim.force('link') as ReturnType<typeof forceLink<SimNode, SimLink>>
    linkForce.distance(p.linkDistance).strength(linkStrength)
    ;(sim.force('x') as ReturnType<typeof forceX<SimNode>>).strength(p.centerStrength)
    ;(sim.force('y') as ReturnType<typeof forceY<SimNode>>).strength(p.centerStrength)
  }

  /** Новые узлы без прошлой позиции вырастают из центра сцены. */
  function spawn(): { x: number; y: number } {
    const angle = Math.random() * Math.PI * 2
    const radius = 30 * Math.sqrt(Math.random())

    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
  }

  return {
    get nodes() {
      return nodes
    },
    get links() {
      return links
    },

    tick() {
      sim.tick()
    },

    alpha() {
      return sim.alpha()
    },

    setData(nextNodes, nextEdges) {
      const prev = new Map(nodes.map((node) => [node.id, node]))
      const nextSimNodes: SimNode[] = nextNodes.map((node) => {
        const old = prev.get(node.id)
        if (old) return { ...node, x: old.x, y: old.y, vx: old.vx, vy: old.vy }

        return { ...node, ...spawn() }
      })

      const byId = new Map(nextSimNodes.map((node) => [node.id, node]))
      const nextSimLinks: SimLink[] = nextEdges
        .filter((edge) => byId.has(edge.source) && byId.has(edge.target))
        .map((edge) => ({
          id: edge.id,
          source: byId.get(edge.source)!,
          target: byId.get(edge.target)!,
          broken: edge.link.targetStatus === 'broken',
        }))

      sim = buildSim(nextSimNodes, nextSimLinks, params)
      nodes = nextSimNodes
      links = nextSimLinks
      sim.alphaTarget(0)
      this.reheat(ALPHA_DATA)
    },

    setParams(next) {
      params = { ...next }
      configure(params)
      this.reheat(ALPHA_PARAMS)
    },

    reheat(level = 1) {
      sim.alpha(Math.max(sim.alpha(), level))
    },

    setDragging(active) {
      sim.alphaTarget(active ? ALPHA_DRAG : 0)
    },
  }
}

/** Доступ к alpha-порогу для внешних проверок «остылости» (экспорт для тестов). */
export const SIMULATION_ALPHA_MIN = ALPHA_MIN
