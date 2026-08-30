import { Plus, Trash2 } from 'lucide-react'
import { EditableText } from '../../components/EditableText'
import type { MatchingAnswer, MatchingTask, MatchPair, TaskComponentProps } from '../../core/types'
import { AddButton, Field, RemoveButton, SectionLabel } from '../shared.style'
import { Cell, Connector, Row, Rows } from './Matching.style'
import { MatchingBoard } from './MatchingBoard'

/** Развилка режимов: edit — редактор пар, solve — доска с drag&drop. */
export function Matching(props: TaskComponentProps<MatchingTask, MatchingAnswer>) {
  if (props.mode === 'edit') {
    return <MatchingEditor task={props.task} onChange={props.onChange} />
  }

  return (
    <MatchingBoard
      task={props.task}
      status={props.status}
      answer={props.answer}
      onAnswer={props.onAnswer}
    />
  )
}

interface MatchingEditorProps {
  task: MatchingTask
  onChange?: (next: MatchingTask) => void
}

/** Редактор: условие + строки пар (термин ↔ определение) с удалением и добавлением. */
function MatchingEditor({ task, onChange }: MatchingEditorProps) {
  const updatePair = (pairId: string, update: Partial<MatchPair>) =>
    onChange?.({
      ...task,
      pairs: task.pairs.map((p) => (p.id === pairId ? { ...p, ...update } : p)),
    })

  const removePair = (pairId: string) =>
    onChange?.({ ...task, pairs: task.pairs.filter((p) => p.id !== pairId) })

  const addPair = () =>
    onChange?.({
      ...task,
      pairs: [...task.pairs, { id: crypto.randomUUID(), left: '', right: '' }],
    })

  return (
    <Field>
      <EditableText
        grow
        editing
        value={task.prompt}
        className="prompt"
        placeholder="Введите условие задачи…"
        onChange={(prompt) => onChange?.({ ...task, prompt })}
      />
      <SectionLabel>Сопоставьте пары: перетащите определения к терминам</SectionLabel>
      <Rows>
        {task.pairs.map((pair) => (
          <Row key={pair.id}>
            <Cell $variant="term">
              <EditableText
                editing
                value={pair.left}
                placeholder="Термин…"
                onChange={(left) => updatePair(pair.id, { left })}
              />
            </Cell>
            <Connector>↔</Connector>
            <Cell $variant="def">
              <EditableText
                editing
                value={pair.right}
                placeholder="Определение…"
                onChange={(right) => updatePair(pair.id, { right })}
              />
            </Cell>
            <RemoveButton
              type="button"
              aria-label="Удалить пару"
              onClick={() => removePair(pair.id)}
            >
              <Trash2 size={15} />
            </RemoveButton>
          </Row>
        ))}
      </Rows>
      <AddButton type="button" onClick={addPair}>
        <Plus size={16} /> Добавить пару
      </AddButton>
    </Field>
  )
}
