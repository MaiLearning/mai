import { Check, ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'
import type { CheckStatus } from '../core/types'
import type { TaskSaveState } from '../lib/useTaskContent'
import { Footer, FooterSide, GhostButton, IconButton, PrimaryButton, Result } from '../viewer.style'

interface WorkspaceFooterProps {
  index: number
  count: number
  editing: boolean
  status: CheckStatus
  saveState: TaskSaveState
  onPrev: () => void
  onNext: () => void
  onCheck: () => void
  onSave: () => void
}

/** Футер воркспейса: навигация, результат проверки, «Сохранить»/«Проверить». */
export function WorkspaceFooter({
  index,
  count,
  editing,
  status,
  saveState,
  onPrev,
  onNext,
  onCheck,
  onSave,
}: WorkspaceFooterProps) {
  return (
    <Footer>
      <FooterSide>
        <GhostButton type="button" disabled={index === 0} onClick={onPrev}>
          <ChevronLeft size={18} /> Назад
        </GhostButton>
      </FooterSide>

      <FooterSide>
        {!editing && status !== 'idle' && (
          <Result $status={status}>
            <CircleCheck size={17} />
            {status === 'correct' ? 'Верно' : 'Есть ошибки'}
          </Result>
        )}
        {editing ? (
          <IconButton $active type="button" disabled={saveState === 'saving'} onClick={onSave}>
            <Check size={15} /> {saveState === 'saving' ? 'Сохранение…' : 'Сохранить'}
          </IconButton>
        ) : (
          <PrimaryButton type="button" onClick={onCheck} disabled={status !== 'idle'}>
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
