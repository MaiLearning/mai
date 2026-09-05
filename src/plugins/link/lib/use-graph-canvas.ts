import { useEffect, useMemo, useRef } from 'react'
import {
  ALPHA_DRAG,
  ALPHA_MIN,
  CLICK_SLOP,
  FIT_ON_ALPHA,
  ZOOM_WHEEL_SENSITIVITY,
} from '../core/constants'
import type { GraphEdge, GraphNode, PhysicsParams } from '../core/types'
import { pickEdge, pickNode } from './picking'
import { type GraphRenderTheme, renderGraph } from './render'
import { createSimulation, type GraphSimulation } from './simulation'
import {
  easeTransform,
  fitTransform,
  type Point,
  screenToWorld,
  type ViewTransform,
  zoomAt,
} from './view-transform'

interface UseGraphCanvasArgs {
  nodes: GraphNode[]
  edges: GraphEdge[]
  params: PhysicsParams
  renderTheme: GraphRenderTheme
  selectedEdgeId: string | null
  onNodeActivate(node: GraphNode): void
  onEdgeSelect(edge: GraphEdge): void
}

export interface GraphControls {
  zoomBy(factor: number): void
  fitView(): void
}

type Interaction = {
  mode: 'idle' | 'pan' | 'drag'
  last: Point
  moved: number
  dragId: string | null
}

const IDLE: Interaction = { mode: 'idle', last: { x: 0, y: 0 }, moved: 0, dragId: null }

/**
 * Холст графа: rAF-цикл (физика → трансформ → отрисовка), pan/zoom мышью
 * и колесом, drag узлов с физикой, hover и клики. React перерисовывается
 * только на смене данных/параметров — анимация целиком в canvas.
 */
export function useGraphCanvas(args: UseGraphCanvasArgs): {
  canvasRef: (element: HTMLCanvasElement | null) => void
  controls: GraphControls
} {
  const argsRef = useRef(args)
  useEffect(() => {
    argsRef.current = args
  })

  const canvasElRef = useRef<HTMLCanvasElement | null>(null)
  const simRef = useRef<GraphSimulation | null>(null)
  const transformRef = useRef<ViewTransform>({ x: 0, y: 0, k: 1 })
  const viewTargetRef = useRef<ViewTransform | null>(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const interactionRef = useRef<Interaction>(IDLE)
  const hoverRef = useRef<string | null>(null)
  const fittedRef = useRef(false)

  const canvasRef = useMemo(
    () => (element: HTMLCanvasElement | null) => {
      canvasElRef.current = element
    },
    [],
  )

  // Смена данных: пересборка симуляции с сохранением позиций, отмена взаимодействий.
  useEffect(() => {
    if (!simRef.current) simRef.current = createSimulation(args.params)
    simRef.current.setData(args.nodes, args.edges)
    fittedRef.current = false
    interactionRef.current = IDLE
    hoverRef.current = null
    // eslint-disable-next-line react-hooks/exhaustive-deps -- params обрабатывает отдельный эффект
  }, [args.nodes, args.edges])

  // Смена параметров физики — мягкая перестройка на лету.
  useEffect(() => {
    simRef.current?.setParams(args.params)
  }, [args.params])

  const controls = useMemo<GraphControls>(
    () => ({
      zoomBy(factor) {
        const { width, height } = sizeRef.current
        viewTargetRef.current = zoomAt(
          transformRef.current,
          { x: width / 2, y: height / 2 },
          factor,
        )
      },
      fitView() {
        const sim = simRef.current
        if (!sim || sim.nodes.length === 0) return
        const { width, height } = sizeRef.current
        viewTargetRef.current = fitTransform(sim.nodes, { width, height })
      },
    }),
    [],
  )

  useEffect(() => {
    const canvas = canvasElRef.current
    if (!canvas) return

    // ── Размеры и DPR ──
    const observer = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const firstSize = sizeRef.current.width === 0 && rect.width > 0
      sizeRef.current = { width: rect.width, height: rect.height, dpr }
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      if (firstSize) {
        transformRef.current = { x: rect.width / 2, y: rect.height / 2, k: 1 }
      }
    })
    observer.observe(canvas)

    // ── Главный цикл ──
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)

      const sim = simRef.current
      const ctx = canvas.getContext('2d')
      if (!sim || !ctx) return

      const { width, height, dpr } = sizeRef.current
      if (width === 0 || height === 0) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (viewTargetRef.current) {
        const { next, done } = easeTransform(transformRef.current, viewTargetRef.current)
        transformRef.current = next
        if (done) viewTargetRef.current = null
      }

      const inter = interactionRef.current
      if (sim.alpha() > ALPHA_MIN || inter.mode !== 'idle') sim.tick()

      // Первое вписывание — когда раскладка сформировалась.
      if (!fittedRef.current && sim.nodes.length > 0 && sim.alpha() < FIT_ON_ALPHA) {
        fittedRef.current = true
        viewTargetRef.current = fitTransform(sim.nodes, { width, height })
      }

      renderGraph({
        ctx,
        width,
        height,
        transform: transformRef.current,
        nodes: sim.nodes,
        links: sim.links,
        theme: argsRef.current.renderTheme,
        hoveredId: hoverRef.current,
        selectedEdgeId: argsRef.current.selectedEdgeId,
      })
    }
    raf = requestAnimationFrame(loop)

    // ── Взаимодействие ──
    const localPoint = (e: PointerEvent | WheelEvent): Point => {
      const rect = canvas.getBoundingClientRect()

      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onPointerDown = (e: PointerEvent) => {
      const sim = simRef.current
      if (!sim) return
      canvas.setPointerCapture(e.pointerId)
      viewTargetRef.current = null

      const p = localPoint(e)
      const hit = pickNode(sim.nodes, transformRef.current, p)
      interactionRef.current = {
        mode: hit ? 'drag' : 'pan',
        last: p,
        moved: 0,
        dragId: hit?.id ?? null,
      }

      if (hit) {
        hit.fx = hit.x
        hit.fy = hit.y
        sim.setDragging(true)
        sim.reheat(ALPHA_DRAG)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const sim = simRef.current
      if (!sim) return
      const inter = interactionRef.current
      const p = localPoint(e)

      if (inter.mode === 'idle') {
        const t = transformRef.current
        const hit = pickNode(sim.nodes, t, p)
        hoverRef.current = hit?.id ?? null
        canvas.style.cursor = hit || pickEdge(sim.links, t, p) ? 'pointer' : 'default'

        return
      }

      const dx = p.x - inter.last.x
      const dy = p.y - inter.last.y
      inter.moved += Math.hypot(dx, dy)
      inter.last = p

      if (inter.mode === 'pan') {
        const t = transformRef.current
        transformRef.current = { ...t, x: t.x + dx, y: t.y + dy }
      } else if (inter.mode === 'drag' && inter.dragId) {
        const node = sim.nodes.find((item) => item.id === inter.dragId)
        if (node) {
          const world = screenToWorld(transformRef.current, p)
          node.fx = world.x
          node.fy = world.y
        }
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      const inter = interactionRef.current
      const sim = simRef.current
      if (inter.mode === 'idle' || !sim) return
      canvas.releasePointerCapture(e.pointerId)

      if (inter.mode === 'pan') {
        if (inter.moved < CLICK_SLOP) {
          const edge = pickEdge(sim.links, transformRef.current, inter.last)
          const graphEdge = edge && argsRef.current.edges.find((item) => item.id === edge.id)
          if (graphEdge) argsRef.current.onEdgeSelect(graphEdge)
        }
      } else if (inter.dragId) {
        const node = sim.nodes.find((item) => item.id === inter.dragId)
        if (node) {
          node.fx = null
          node.fy = null
        }
        sim.setDragging(false)
        if (inter.moved < CLICK_SLOP) {
          const graphNode = argsRef.current.nodes.find((item) => item.id === inter.dragId)
          if (graphNode) argsRef.current.onNodeActivate(graphNode)
        }
      }

      interactionRef.current = IDLE
      hoverRef.current = null
    }

    const onPointerLeave = () => {
      if (interactionRef.current.mode === 'idle') hoverRef.current = null
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      viewTargetRef.current = null
      const factor = Math.exp(-e.deltaY * ZOOM_WHEEL_SENSITIVITY)
      transformRef.current = zoomAt(transformRef.current, localPoint(e), factor)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  return { canvasRef, controls }
}
