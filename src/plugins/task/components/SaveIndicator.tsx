import type { TaskSaveState } from '../lib/useTaskContent'
import { Dot, IndicatorRoot } from './SaveIndicator.style'

const LABEL: Record<TaskSaveState, string> = {
  idle: 'Автосохранение включено',
  saving: 'Сохранение…',
  saved: 'Сохранено',
  error: 'Ошибка сохранения',
}

const TONE: Record<TaskSaveState, 'muted' | 'primary' | 'success' | 'danger'> = {
  idle: 'muted',
  saving: 'primary',
  saved: 'success',
  error: 'danger',
}

/** Точка-индикатор автосохранения, тихая замена кнопки «Сохранить». */
export function SaveIndicator({ state }: { state: TaskSaveState }) {
  return (
    <IndicatorRoot>
      <Dot $tone={TONE[state]} />
      {LABEL[state]}
    </IndicatorRoot>
  )
}
