import { Check, Plus, X } from 'lucide-react'
import type { StepStatus } from '../core/types'
import { Step, StepAdd, StepStrip } from '../viewer.style'

interface CodeStepperProps {
  count: number
  index: number
  stepState: (i: number) => StepStatus
  onSelect: (i: number) => void
  /** Показывается только в edit-режиме. */
  onAdd?: () => void
}

/** Степ-полоса урока: навигация по шагам + dashed-шаг создания (edit-режим). */
export function CodeStepper({ count, index, stepState, onSelect, onAdd }: CodeStepperProps) {
  return (
    <StepStrip role="tablist" aria-label="Навигация по шагам урока">
      {Array.from({ length: count }, (_, i) => {
        const st = stepState(i)

        return (
          <Step
            key={i}
            $state={st}
            role="tab"
            aria-selected={i === index}
            aria-label={`Шаг ${i + 1}`}
            onClick={() => onSelect(i)}
          >
            {st === 'passed' ? <Check size={15} /> : st === 'failed' ? <X size={15} /> : i + 1}
          </Step>
        )
      })}

      {onAdd && (
        <StepAdd type="button" aria-label="Добавить шаг" onClick={onAdd}>
          <Plus size={15} />
        </StepAdd>
      )}
    </StepStrip>
  )
}
