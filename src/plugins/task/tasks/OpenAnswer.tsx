import { Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { EditableText } from '../components/EditableText'
import type { OpenAnswerTask, TaskComponentProps } from '../core/types'
import { SampleBody, SampleCard, TextArea } from './OpenAnswer.style'
import { Field, SectionLabel } from './shared.style'

export function OpenAnswer({ task, mode, status }: TaskComponentProps<OpenAnswerTask>) {
  const editing = mode === 'edit'
  const [value, setValue] = useState('')

  return (
    <Field>
      <EditableText editing={editing} value={task.prompt} className="prompt" />
      <SectionLabel>Развёрнутый ответ</SectionLabel>
      {editing ? (
        <SampleCard>
          <Lightbulb size={20} />
          <SampleBody>
            <span className="label">Эталонный ответ (для автора)</span>
            <EditableText editing value={task.sampleAnswer} className="text" />
          </SampleBody>
        </SampleCard>
      ) : (
        <>
          <TextArea
            placeholder={task.placeholder}
            value={value}
            disabled={status !== 'idle'}
            $state={status}
            onChange={(e) => setValue(e.target.value)}
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
