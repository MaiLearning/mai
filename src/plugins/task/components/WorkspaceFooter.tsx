import { Check, ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'
import type { CheckStatus } from '../core/types'
import type { TaskSaveState } from '../lib/useTaskContent'
import { Footer, FooterSide, GhostButton, PrimaryButton, Result } from '../viewer.style'
import { SaveIndicator } from './SaveIndicator'

interface WorkspaceFooterProps {
  index: number
  count: number
  editing: boolean
  status: CheckStatus
  saveState: TaskSaveState
  onPrev: () => void
  onNext: () => void
  onCheck: () => void
}

/** Футер воркспейса: навигация, индикатор автосохранения, результат проверки. */
export function WorkspaceFooter({
  index,
  count,
  editing,
  status,
  saveState,
  onPrev,
  onNext,
  onCheck,
}: WorkspaceFooterProps) {
  return (
    <Footer>
      <FooterSide>
        <GhostButton type="button" disabled={index === 0} onClick={onPrev}>
          <ChevronLeft size={18} /> Назад
        </GhostButton>
        <SaveIndicator state={saveState} />
      </FooterSide>

      <FooterSide>
        {!editing && status !== 'idle' && (
          <Result $status={status}>
            <CircleCheck size={17} />
            {status === 'correct' ? 'Верно' : 'Есть ошибки'}
          </Result>
        )}
        {!editing && (
          <PrimaryButton type="button" onClick={onCheck}>
            <Check size={18} /> Проверить
          </PrimaryButton>
        )}
        <GhostButton type="button" disabled={index === count - 1} onClick={onNext}>
          Вперёд <ChevronRight size={18} />
        </GhostButton>
      </FooterSide>
    </Footer>
  )
}
