import type { CodeStep } from '../../entity'
import {
  Instructions,
  InstructionsEmpty,
  InstructionsText,
  InstructionsTitle,
} from './InstructionsBlock.style'

interface InstructionsBlockProps {
  step: CodeStep
  stepNo: number
}

/** Инструкция шага в режиме прохождения. */
export function InstructionsBlock({ step, stepNo }: InstructionsBlockProps) {
  const title = step.title.trim() === '' ? `Шаг ${stepNo}` : step.title.trim()

  return (
    <Instructions aria-label="Инструкция шага">
      <InstructionsTitle>{title}</InstructionsTitle>
      {step.instructions.trim() === '' ? (
        <InstructionsEmpty>Автор не добавил инструкцию к этому шагу</InstructionsEmpty>
      ) : (
        <InstructionsText>{step.instructions}</InstructionsText>
      )}
    </Instructions>
  )
}
