import type { CodeLanguage, CodeStep } from '@/entities/code-plugin'
import { CodeEditor } from './CodeEditor'
import { Field, FieldLabel, Hint, Root, TextArea, TextInput } from './StepSettings.style'

interface StepSettingsProps {
  step: CodeStep
  language: CodeLanguage
  onChange: (patch: Partial<Omit<CodeStep, 'id'>>) => void
}

/**
 * Редактор шага (edit-режим): название, инструкция, ожидаемый вывод,
 * стартовый код. Любая правка сбрасывает результат прохождения шага.
 */
export function StepSettings({ step, language, onChange }: StepSettingsProps) {
  return (
    <Root aria-label="Настройки шага">
      <Field>
        <FieldLabel>Название шага</FieldLabel>
        <TextInput
          value={step.title}
          placeholder={`Например: Вывод строки`}
          maxLength={200}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Field>

      <Field>
        <FieldLabel>Инструкция</FieldLabel>
        <TextArea
          value={step.instructions}
          placeholder="Что нужно сделать ученику в этом шаге"
          maxLength={5000}
          onChange={(e) => onChange({ instructions: e.target.value })}
        />
      </Field>

      <Field>
        <FieldLabel>Стартовый код</FieldLabel>
        <CodeEditor
          language={language}
          value={step.starterCode}
          onChange={(value) => onChange({ starterCode: value })}
          ariaLabel="Стартовый код шага"
        />
      </Field>

      <Field>
        <FieldLabel>Ожидаемый вывод</FieldLabel>
        <TextArea
          value={step.expectedOutput}
          placeholder="Точный вывод программы (без начальных/конечных пробелов)"
          maxLength={100000}
          onChange={(e) => onChange({ expectedOutput: e.target.value })}
        />
        <Hint>
          Проверка: вывод сравнивается с ожидаемым без учёта пробелов по краям, код выхода должен
          быть 0.
        </Hint>
      </Field>
    </Root>
  )
}
