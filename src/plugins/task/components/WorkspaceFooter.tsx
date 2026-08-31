import { Check, ChevronLeft, ChevronRight, CircleAlert, CircleCheck, RotateCcw } from 'lucide-react'
import { Tooltip } from '@/app/theme/components/Tooltip'
import type { CheckStatus } from '../core/types'
import type { SaveState } from '../lib/useSavePipeline'
import { SaveIndicator } from './SaveIndicator'
import {
  ActionButton,
  ActionLabel,
  Footer,
  FooterEnd,
  FooterStart,
  NavButton,
  Result,
  ResultLabel,
} from './WorkspaceFooter.style'

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

/** Футер воркспейса: иконная навигация, статусы слева, действия справа. */
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
  const checked = !editing && status !== 'idle'

  return (
    <Footer>
      <FooterStart>
        <Tooltip content="Назад">
          <NavButton type="button" disabled={index === 0} onClick={onPrev} aria-label="Назад">
            <ChevronLeft size={18} />
          </NavButton>
        </Tooltip>
        <SaveIndicator state={saveState} />
        {checked && (
          <Result $status={status}>
            {status === 'correct' ? <CircleCheck size={17} /> : <CircleAlert size={17} />}
            <ResultLabel>{status === 'correct' ? 'Верно' : 'Есть ошибки'}</ResultLabel>
          </Result>
        )}
      </FooterStart>

      <FooterEnd>
        {!editing && status === 'idle' && (
          <Tooltip content="Проверить">
            <ActionButton type="button" onClick={onCheck}>
              <Check size={18} />
              <ActionLabel>Проверить</ActionLabel>
            </ActionButton>
          </Tooltip>
        )}
        {checked && (
          <Tooltip content="Пройти заново">
            <ActionButton type="button" onClick={onRestart}>
              <RotateCcw size={16} />
              <ActionLabel>Пройти заново</ActionLabel>
            </ActionButton>
          </Tooltip>
        )}
        <Tooltip content="Вперёд">
          <NavButton
            type="button"
            disabled={index === count - 1}
            onClick={onNext}
            aria-label="Вперёд"
          >
            <ChevronRight size={18} />
          </NavButton>
        </Tooltip>
      </FooterEnd>
    </Footer>
  )
}
