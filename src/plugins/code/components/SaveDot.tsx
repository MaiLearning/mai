import type { SaveState } from '../lib/useCodeAutosave'
import { Dot, IndicatorRoot, Label } from './SaveDot.style'

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
export function SaveDot({ state }: { state: SaveState }) {
  return (
    <IndicatorRoot>
      <Dot $tone={TONE[state]} />
      <Label>{LABEL[state]}</Label>
    </IndicatorRoot>
  )
}
