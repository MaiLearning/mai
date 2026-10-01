import { useEffect, useState } from 'react'
import type { CodeLessonContent, CodeStep } from '../../entity'
import type { StepStatus, ViewMode } from '../core/types'
import type { SaveState } from '../lib/useCodeAutosave'
import { useCodeRun } from '../lib/useCodeRun'
import { Body, BodyInner, Viewer } from '../viewer.style'
import { CodeEditor } from './CodeEditor'
import { InstructionsBlock } from './InstructionsBlock'
import { RunOutput } from './RunOutput'
import { StepSettings } from './StepSettings'
import { WorkspaceFooter } from './WorkspaceFooter'
import { WorkspaceHeader } from './WorkspaceHeader'

interface CodeWorkspaceProps {
  content: CodeLessonContent
  initialMode: ViewMode
  saveState: SaveState
  title: string
  onTitleChange: (value: string) => void
  onTitleCommit: () => void
  addStep: () => string
  deleteStep: (stepId: string) => void
  updateStep: (stepId: string, patch: Partial<Omit<CodeStep, 'id'>>) => void
  setLanguage: (language: CodeLessonContent['language']) => void
  setStepCode: (stepId: string, code: string) => void
  setStepResult: (stepId: string, result: 'passed' | 'failed') => void
  resetStep: (stepId: string) => void
}

/**
 * Оболочка урока кода: степ-полоса (навигация + создание), режимы
 * «Прохождение/Редактор», редактор кода, запуск и проверка, футер.
 * Контент живёт в useCodeContent; запуск и его результат — в useCodeRun.
 */
export function CodeWorkspace({
  content,
  initialMode,
  saveState,
  title,
  onTitleChange,
  onTitleCommit,
  addStep,
  deleteStep,
  updateStep,
  setLanguage,
  setStepCode,
  setStepResult,
  resetStep,
}: CodeWorkspaceProps) {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<ViewMode>(initialMode)
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null)
  const { running, runOutput, check, clearOutput } = useCodeRun()

  const { steps, language, code, results } = content

  /** Страховка границ: индекс не выходит за пределы набора шагов. */
  useEffect(() => {
    setIndex((prev) => Math.min(prev, steps.length - 1))
  }, [steps.length])

  /** Фокус на созданном шаге — по факту его появления в наборе. */
  useEffect(() => {
    if (pendingFocusId === null) return
    const i = steps.findIndex((s) => s.id === pendingFocusId)
    if (i < 0) return

    setIndex(i)
    setMode('edit')
    setPendingFocusId(null)
  }, [pendingFocusId, steps])

  /** Смена шага сбрасывает панель результата запуска. */
  useEffect(() => {
    clearOutput()
  }, [index, clearOutput])

  const step = steps[index]
  if (!step) {
    // Clamp-effect держит индекс в границах; guard — крайняя защита от рассинхрона.
    return (
      <Viewer aria-label="Урок кода">
        <Body>
          <BodyInner />
        </Body>
      </Viewer>
    )
  }

  const status = (results[step.id] ?? 'idle') as StepStatus
  const editing = mode === 'edit'

  const stepState = (i: number): StepStatus => {
    if (i === index) return 'current'

    const s = results[steps[i].id]
    if (s === 'passed') return 'passed'
    if (s === 'failed') return 'failed'

    return 'idle'
  }

  /** Создание шага: фокус и режим редактора — после его появления. */
  const create = () => setPendingFocusId(addStep())

  /** Правка кода ученика: результат шага сбрасывается, панель вывода гаснет. */
  const handleCodeChange = (value: string) => {
    setStepCode(step.id, value)
    clearOutput()
  }

  /** Запуск кода шага и фиксация результата проверки. */
  const handleCheck = () => void check(language, step, code[step.id] ?? '', setStepResult)

  /** Перезапуск прохождения: результат стирается, код остаётся. */
  const restart = () => {
    resetStep(step.id)
    clearOutput()
  }

  const go = (dir: -1 | 1) => {
    setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + dir)))
  }

  return (
    <Viewer aria-label="Урок кода">
      <WorkspaceHeader
        title={title}
        onTitleChange={onTitleChange}
        onTitleCommit={onTitleCommit}
        steps={steps}
        index={index}
        mode={mode}
        language={language}
        stepState={stepState}
        onSelect={setIndex}
        onSetMode={setMode}
        onAddStep={create}
        onDeleteStep={deleteStep}
        onLanguageChange={setLanguage}
      />

      <Body>
        <BodyInner>
          {editing ? (
            <StepSettings
              step={step}
              language={language}
              onChange={(patch) => updateStep(step.id, patch)}
            />
          ) : (
            <>
              <InstructionsBlock step={step} stepNo={index + 1} />
              <CodeEditor
                language={language}
                value={code[step.id] ?? step.starterCode}
                onChange={handleCodeChange}
                ariaLabel="Код решения"
              />
              <RunOutput output={runOutput.output} error={runOutput.error} />
            </>
          )}
        </BodyInner>
      </Body>

      <WorkspaceFooter
        index={index}
        count={steps.length}
        editing={editing}
        status={status}
        saveState={saveState}
        running={running}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onCheck={handleCheck}
        onRestart={restart}
      />
    </Viewer>
  )
}
