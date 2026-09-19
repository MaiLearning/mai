import { ProgressFill, ProgressTrack } from './progress.style'

export interface ProgressProps {
  percent: number
  'aria-label'?: string
}

export function Progress({ percent, 'aria-label': ariaLabel = 'Прогресс' }: ProgressProps) {
  const normalizedPercent = Math.min(100, Math.max(0, percent))

  return (
    <ProgressTrack
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={normalizedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <ProgressFill $percent={normalizedPercent} />
    </ProgressTrack>
  )
}
