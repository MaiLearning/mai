import { SpinnerRoot } from './spinner.style'

export type SpinnerSpeed = 'slow' | 'normal' | 'fast'

export interface SpinnerProps {
  label?: string
  /** Скорость вращения: slow — 1.2s, normal — 0.8s (по умолчанию), fast — 0.5s. */
  speed?: SpinnerSpeed
}

export function Spinner({ label = 'Загрузка', speed = 'normal' }: SpinnerProps) {
  return <SpinnerRoot $speed={speed} role="status" aria-label={label} />
}
