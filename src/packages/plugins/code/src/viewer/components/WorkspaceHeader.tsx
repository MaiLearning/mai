import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CodeLanguage, CodeStep } from '../../entity'
import { LANGUAGE_LABEL, type StepStatus, type ViewMode } from '../core/types'
import { stepTitle } from '../lib/useCodeContent'
import {
  Badge,
  DeleteStepButton,
  Header,
  KindBadge,
  MetaLeft,
  MetaRow,
  ModeButton,
  ModeToggle,
} from '../viewer.style'
import { CodeStepper } from './CodeStepper'
import { LanguageSelect, TitleInput, TopRow } from './WorkspaceHeader.style'

interface WorkspaceHeaderProps {
  title: string
  onTitleChange: (value: string) => void
  /** Коммит названия (blur / Enter) — сохранение ресурса на backend. */
  onTitleCommit: () => void
  steps: CodeStep[]
  index: number
  mode: ViewMode
  language: CodeLanguage
  stepState: (i: number) => StepStatus
  onSelect: (i: number) => void
  onSetMode: (mode: ViewMode) => void
  onAddStep: () => void
  onDeleteStep: (stepId: string) => void
  onLanguageChange: (language: CodeLanguage) => void
}

/** Шапка урока: название, степ-полоса, метаданные (шаг/язык/удаление), режимы. */
export function WorkspaceHeader({
  title,
  onTitleChange,
  onTitleCommit,
  steps,
  index,
  mode,
  language,
  stepState,
  onSelect,
  onSetMode,
  onAddStep,
  onDeleteStep,
  onLanguageChange,
}: WorkspaceHeaderProps) {
  const editing = mode === 'edit'
  const step = steps[index]
  const titleRef = useRef(title)
  titleRef.current = title
  const [draft, setDraft] = useState(title)

  // Смена ресурса синхронизирует черновик названия.
  useEffect(() => {
    setDraft(title)
  }, [title])

  const commit = () => {
    if (draft.trim() !== titleRef.current.trim()) onTitleCommit()
    setDraft(draft.trim() === '' ? titleRef.current : draft)
  }

  return (
    <Header>
      <TopRow>
        <TitleInput
          value={draft}
          placeholder="Название урока"
          aria-label="Название урока"
          onChange={(e) => {
            setDraft(e.target.value)
            onTitleChange(e.target.value)
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
        />
        <ModeToggle role="group" aria-label="Режим отображения">
          <ModeButton type="button" $active={!editing} onClick={() => onSetMode('solve')}>
            <Eye size={15} /> Прохождение
          </ModeButton>
          <ModeButton type="button" $active={editing} onClick={() => onSetMode('edit')}>
            <Pencil size={15} /> Редактор
          </ModeButton>
        </ModeToggle>
      </TopRow>

      <CodeStepper
        count={steps.length}
        index={index}
        stepState={stepState}
        onSelect={onSelect}
        onAdd={onAddStep}
      />

      <MetaRow>
        <MetaLeft>
          <KindBadge>{`Шаг ${index + 1} / ${steps.length}`}</KindBadge>
          <Badge>{step ? stepTitle(step, index) : ''}</Badge>
          {editing ? (
            <>
              <LanguageSelect
                value={language}
                aria-label="Язык урока"
                onChange={(e) => onLanguageChange(e.target.value as CodeLanguage)}
              >
                {Object.entries(LANGUAGE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </LanguageSelect>
              {step && (
                <DeleteStepButton
                  type="button"
                  aria-label="Удалить шаг"
                  title="Удалить шаг"
                  onClick={() => onDeleteStep(step.id)}
                >
                  <Trash2 size={15} />
                </DeleteStepButton>
              )}
            </>
          ) : (
            <KindBadge>{LANGUAGE_LABEL[language]}</KindBadge>
          )}
        </MetaLeft>
      </MetaRow>
    </Header>
  )
}
