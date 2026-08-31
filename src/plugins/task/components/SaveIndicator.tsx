import type { SaveState } from '../lib/useSavePipeline'
import { Dot, IndicatorRoot } from './SaveIndicator.style'

const LABEL: Record<SaveState, string> = {
  idle: 'Автосохранение включено',
  saving: 'Сохранение…',
  saved: 'Сохранено',
  error: 'Ошибка сохранения',
}

const TONE: Record<SaveState, 'muted' | 'primary' | 'success' | 'danger'> = {
  idle: 'muted',
  saving: 'primary',
  saved: 'success',
  error: 'danger',
}

/** Точка-индикатор автосохранения, тихая замена кнопки «Сохранить». */
export function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <IndicatorRoot>
      <Dot $tone={TONE[state]} />
      {LABEL[state]}
    </IndicatorRoot>
  )
}
