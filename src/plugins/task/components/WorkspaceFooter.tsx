import { Check, ChevronLeft, ChevronRight, CircleCheck, RotateCcw } from 'lucide-react'
import type { CheckStatus } from '../core/types'
import type { SaveState } from '../lib/useSavePipeline'
import { Footer, FooterSide, GhostButton, PrimaryButton, Result } from '../viewer.style'
import { SaveIndicator } from './SaveIndicator'

interface WorkspaceFooterProps {
  index: number
  count: number
  editing: boolean
  status: CheckStatus
  saveState: SaveState
  onPrev: () => void
  onNext: () => void
  onCheck: () => void
  onRestart: () => void
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
  onRestart,
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
          <>
            <Result $status={status}>
              <CircleCheck size={17} />
              {status === 'correct' ? 'Верно' : 'Есть ошибки'}
            </Result>
            <GhostButton type="button" onClick={onRestart}>
              <RotateCcw size={16} /> Пройти заново
            </GhostButton>
          </>
        )}
        {!editing && status === 'idle' && (
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
