import { Check, Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { AnyTask, TaskKind } from '../core/types'
import { Step, StepAdd, StepStrip } from '../viewer.style'
import { KindMenu } from './KindMenu'
import { Popover } from './Popover'

type StepStatus = 'idle' | 'current' | 'correct' | 'incorrect'

interface TaskStepperProps {
  tasks: AnyTask[]
  index: number
  stepState: (i: number) => StepStatus
  onSelect: (i: number) => void
  onCreate: (kind: TaskKind) => void
}

/** Степ-полоса: навигация по задачам + dashed-шаг создания новой (меню типов). */
export function TaskStepper({ tasks, index, stepState, onSelect, onCreate }: TaskStepperProps) {
  const [kindMenuOpen, setKindMenuOpen] = useState(false)

  return (
    <StepStrip role="tablist" aria-label="Навигация по задачам">
      {tasks.map((t, i) => {
        const st = stepState(i)

        return (
          <Step
            key={t.id}
            $state={st}
            role="tab"
            aria-selected={i === index}
            aria-label={`Задача ${i + 1}`}
            onClick={() => onSelect(i)}
          >
            {st === 'correct' ? <Check size={15} /> : st === 'incorrect' ? <X size={15} /> : i + 1}
          </Step>
        )
      })}

      <Popover
        open={kindMenuOpen}
        onClose={() => setKindMenuOpen(false)}
        align="start"
        anchor={
          <StepAdd
            type="button"
            aria-label="Добавить задачу"
            aria-haspopup="menu"
            aria-expanded={kindMenuOpen}
            onClick={() => setKindMenuOpen(true)}
          >
            <Plus size={15} />
          </StepAdd>
        }
      >
        <KindMenu
          onSelect={(kind) => {
            setKindMenuOpen(false)
            onCreate(kind)
          }}
        />
      </Popover>
    </StepStrip>
  )
}
