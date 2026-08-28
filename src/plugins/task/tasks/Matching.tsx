import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { EditableText } from '../components/EditableText'
import type { MatchingTask, TaskComponentProps } from '../core/types'
import { Cell, Connector, Row, Rows, Spacer } from './Matching.style'
import { AddButton, Field, RemoveButton, SectionLabel } from './shared.style'

export function Matching({ task, mode, status }: TaskComponentProps<MatchingTask>) {
  const editing = mode === 'edit'
  const state = editing
    ? 'idle'
    : status === 'correct'
      ? 'correct'
      : status === 'incorrect'
        ? 'incorrect'
        : 'idle'

  return (
    <Field>
      <EditableText editing={editing} value={task.prompt} className="prompt" />
      <SectionLabel>Сопоставьте пары: перетащите определения к терминам</SectionLabel>
      <Rows>
        {task.pairs.map((pair) => (
          <Row key={pair.id}>
            <Cell $variant="term">
              <EditableText editing={editing} value={pair.left} />
            </Cell>
            <Connector>↔</Connector>
            <Cell $variant="def" $state={state}>
              {!editing && <GripVertical className="grip" size={16} />}
              <EditableText editing={editing} value={pair.right} />
            </Cell>
            {editing ? (
              <RemoveButton type="button" aria-label="Удалить пару">
                <Trash2 size={15} />
              </RemoveButton>
            ) : (
              <Spacer />
            )}
          </Row>
        ))}
      </Rows>
      {editing && (
        <AddButton type="button">
          <Plus size={16} /> Добавить пару
        </AddButton>
      )}
    </Field>
  )
}
