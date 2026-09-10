import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import { Tooltip } from '@/app/theme/components/Tooltip'
import type { StepStatus } from '../core/types'
import type { SaveState } from '../lib/useCodeAutosave'
import { SaveDot } from './SaveDot'
import {
  ActionButton,
  ActionLabel,
  Footer,
  FooterEnd,
  FooterStart,
  NavButton,
  Result,
} from './WorkspaceFooter.style'

interface WorkspaceFooterProps {
  index: number
  count: number
  editing: boolean
  status: StepStatus
  saveState: SaveState
  running: boolean
  onPrev: () => void
  onNext: () => void
  onCheck: () => void
  onRestart: () => void
}

/** Футер урока: иконная навигация, индикатор сохранения, статусы, действия. */
export function WorkspaceFooter({
  index,
  count,
  editing,
  status,
  saveState,
  running,
  onPrev,
  onNext,
  onCheck,
  onRestart,
}: WorkspaceFooterProps) {
  const checked = !editing && (status === 'passed' || status === 'failed')

  return (
    <Footer>
      <FooterStart>
        <Tooltip content="Назад">
          <NavButton type="button" disabled={index === 0} onClick={onPrev} aria-label="Назад">
            <ChevronLeft size={18} />
          </NavButton>
        </Tooltip>
        <SaveDot state={saveState} />
        {checked && (
          <Result $status={status}>
            {status === 'passed' ? <CircleCheck size={17} /> : <CircleAlert size={17} />}
            {status === 'passed' ? 'Проверка пройдена' : 'Проверка не пройдена'}
          </Result>
        )}
      </FooterStart>

      <FooterEnd>
        {!editing && status !== 'passed' && status !== 'failed' && (
          <Tooltip content="Запустить и проверить">
            <ActionButton type="button" disabled={running} onClick={onCheck}>
              {running ? <Loader2 size={16} className="spin" /> : <Check size={18} />}
              <ActionLabel>{running ? 'Запуск…' : 'Проверить'}</ActionLabel>
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
