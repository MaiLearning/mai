import { useTranslation } from '@mai/i18n'
import { Tooltip, useAppTheme } from '@mai/theme'
import { Scan, SlidersHorizontal, ZoomIn, ZoomOut } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DEFAULT_PHYSICS, ZOOM_BUTTON_FACTOR } from '../core/constants'
import type { GraphEdge, GraphNode, PhysicsParams } from '../core/types'
import { toRenderTheme } from '../lib/render'
import { useGraphCanvas } from '../lib/useGraphCanvas'
import { GraphSettingsPanel } from './GraphSettingsPanel'
import { CanvasWrap, ControlButton, ControlsBar, OverlayRail } from './LinkGraph.style'

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
  const theme = useAppTheme().theme
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
          <Tooltip content={t('zoom_in')}>
            <ControlButton
              aria-label={t('zoom_in')}
              onClick={() => controls.zoomBy(ZOOM_BUTTON_FACTOR)}
              onlyIcon={<ZoomIn size={18} />}
            />
          </Tooltip>
          <Tooltip content={t('zoom_out')}>
            <ControlButton
              aria-label={t('zoom_out')}
              onClick={() => controls.zoomBy(1 / ZOOM_BUTTON_FACTOR)}
              onlyIcon={<ZoomOut size={18} />}
            />
          </Tooltip>
          <Tooltip content={t('fit_view')}>
            <ControlButton
              aria-label={t('fit_view')}
              onClick={() => controls.fitView()}
              onlyIcon={<Scan size={18} />}
            />
          </Tooltip>
          <Tooltip content={t('graph_settings')}>
            <ControlButton
              aria-label={t('graph_settings')}
              selected={settingsOpen}
              onClick={() => setSettingsOpen((open) => !open)}
              onlyIcon={<SlidersHorizontal size={18} />}
            />
          </Tooltip>
        </ControlsBar>

        {settingsOpen && <GraphSettingsPanel params={params} onChange={setParams} />}
      </OverlayRail>
    </CanvasWrap>
  )
}
