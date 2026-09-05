import { Scan, SlidersHorizontal, ZoomIn, ZoomOut } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { IconButton } from '@/app/theme/components'
import { DEFAULT_PHYSICS, ZOOM_BUTTON_FACTOR } from '../core/constants'
import type { GraphEdge, GraphNode, PhysicsParams } from '../core/types'
import { toRenderTheme } from '../lib/render'
import { useGraphCanvas } from '../lib/use-graph-canvas'
import { GraphSettingsPanel } from './GraphSettingsPanel'
import { CanvasWrap, ControlsBar, OverlayRail } from './LinkGraph.style'

export interface LinkGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selectedEdgeId: string | null
  onNodeActivate: (node: GraphNode) => void
  onEdgeSelect: (edge: GraphEdge) => void
}

/**
 * Холст графа: canvas + живая физика, оверлей управления (зум, вписать,
 * настройки). Стили рёбер и битые цели — в canvas-рендере (lib/render).
 */
export function LinkGraph({
  nodes,
  edges,
  selectedEdgeId,
  onNodeActivate,
  onEdgeSelect,
}: LinkGraphProps) {
  const { t } = useTranslation('link')
  const theme = useTheme()
  const [params, setParams] = useState<PhysicsParams>(DEFAULT_PHYSICS)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const renderTheme = useMemo(() => toRenderTheme(theme), [theme])
  const { canvasRef, controls } = useGraphCanvas({
    nodes,
    edges,
    params,
    renderTheme,
    selectedEdgeId,
    onNodeActivate,
    onEdgeSelect,
  })

  return (
    <CanvasWrap>
      <canvas ref={canvasRef} />
      <OverlayRail>
        <ControlsBar>
          <IconButton label={t('zoom_in')} onClick={() => controls.zoomBy(ZOOM_BUTTON_FACTOR)}>
            <ZoomIn size={18} />
          </IconButton>
          <IconButton label={t('zoom_out')} onClick={() => controls.zoomBy(1 / ZOOM_BUTTON_FACTOR)}>
            <ZoomOut size={18} />
          </IconButton>
          <IconButton label={t('fit_view')} onClick={() => controls.fitView()}>
            <Scan size={18} />
          </IconButton>
          <IconButton label={t('graph_settings')} onClick={() => setSettingsOpen((open) => !open)}>
            <SlidersHorizontal size={18} />
          </IconButton>
        </ControlsBar>

        {settingsOpen && <GraphSettingsPanel params={params} onChange={setParams} />}
      </OverlayRail>
    </CanvasWrap>
  )
}
