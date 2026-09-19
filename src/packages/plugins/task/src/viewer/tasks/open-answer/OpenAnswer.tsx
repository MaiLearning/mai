import { Lightbulb } from 'lucide-react'
import { EditableText } from '../../components/EditableText'
import type { OpenAnswerAnswer, OpenAnswerTask, TaskComponentProps } from '../../core/types'
import { Field, SectionLabel } from '../shared.style'
import { EditRow, SampleBody, SampleCard, TextArea } from './OpenAnswer.style'

export function OpenAnswer({
  task,
  mode,
  status,
  onChange,
  answer,
  onAnswer,
}: TaskComponentProps<OpenAnswerTask, OpenAnswerAnswer>) {
  const editing = mode === 'edit'
  /** После проверки ответ зафиксирован; правка задачи или «Пройти заново» открывают его снова. */
  const locked = !editing && status !== 'idle'
  const value = answer?.kind === 'OpenAnswer' ? answer.text : ''

  return (
    <Field>
      <EditableText
        editing={editing}
        grow={editing}
        value={task.prompt}
        className="prompt"
        placeholder="Введите условие задачи…"
        onChange={(prompt) => onChange?.({ ...task, prompt })}
      />
      <SectionLabel>Развёрнутый ответ</SectionLabel>
      {editing ? (
        <>
          <SampleCard>
            <Lightbulb size={20} />
            <SampleBody>
              <span className="label">Эталонный ответ (для автора)</span>
              <EditableText
                editing
                value={task.sampleAnswer}
                className="text"
                placeholder="Введите эталонный ответ…"
                onChange={(sampleAnswer) => onChange?.({ ...task, sampleAnswer })}
              />
            </SampleBody>
          </SampleCard>
          <SectionLabel>Подсказка поля</SectionLabel>
          <EditRow>
            <EditableText
              editing
              grow
              value={task.placeholder}
              placeholder="Введите подсказку поля…"
              onChange={(placeholder) => onChange?.({ ...task, placeholder })}
            />
          </EditRow>
        </>
      ) : (
        <>
          <TextArea
            placeholder={task.placeholder}
            value={value}
            $state={status}
            $locked={locked}
            readOnly={locked}
            onChange={(e) => {
              if (locked) return
              onAnswer?.({ kind: 'OpenAnswer', text: e.target.value })
            }}
          />
          {status === 'correct' && (
            <SampleCard>
              <Lightbulb size={20} />
              <SampleBody>
                <span className="label">Пример ответа</span>
                <span className="text">{task.sampleAnswer}</span>
              </SampleBody>
            </SampleCard>
          )}
        </>
      )}
    </Field>
  )
}
