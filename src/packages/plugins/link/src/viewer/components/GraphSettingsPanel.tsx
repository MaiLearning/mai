import { useTranslation } from '@mai/i18n'
import { Button } from '@mai/theme'
import { DEFAULT_PHYSICS, PHYSICS_LIMITS } from '../core/constants'
import type { PhysicsParams } from '../core/types'
import { Panel, Row, RowLabel, RowValue, Slider } from './GraphSettingsPanel.style'

interface GraphSettingsPanelProps {
  params: PhysicsParams
  onChange(params: PhysicsParams): void
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange(value: number): void
}) {
  return (
    <Row>
      <RowLabel>{label}</RowLabel>
      <Slider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <RowValue>{value}</RowValue>
    </Row>
  )
}

/** Панель настроек физики графа — слайдеры, как в Obsidian. */
export function GraphSettingsPanel({ params, onChange }: GraphSettingsPanelProps) {
  const { t } = useTranslation('link')

  return (
    <Panel>
      <SliderRow
        label={t('settings_repulsion')}
        value={params.repulsion}
        onChange={(repulsion) => onChange({ ...params, repulsion })}
        {...PHYSICS_LIMITS.repulsion}
      />
      <SliderRow
        label={t('settings_link_distance')}
        value={params.linkDistance}
        onChange={(linkDistance) => onChange({ ...params, linkDistance })}
        {...PHYSICS_LIMITS.linkDistance}
      />
      <SliderRow
        label={t('settings_center')}
        value={params.centerStrength}
        onChange={(centerStrength) => onChange({ ...params, centerStrength })}
        {...PHYSICS_LIMITS.centerStrength}
      />
      <Button variant="secondary" onClick={() => onChange(DEFAULT_PHYSICS)}>
        {t('settings_reset')}
      </Button>
    </Panel>
  )
}
