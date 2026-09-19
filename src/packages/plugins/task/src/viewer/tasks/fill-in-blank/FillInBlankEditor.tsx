import { Fragment, useEffect, useRef, useState } from 'react'
import { EditableText } from '../../components/EditableText'
import type { BlankSegment, FillInBlankTask } from '../../core/types'
import { Field, SectionLabel } from '../shared.style'
import { BlankChip } from './BlankChip'
import { Paragraph, Toolbar, ToolbarButton } from './FillInBlank.style'
import { dropEmpty, makeBlank, reIdByPosition, removeBlank } from './model/blanks'
import { segmentsFromDom, selectionTarget } from './model/dom'

interface FillInBlankEditorProps {
  task: FillInBlankTask
  onChange: (next: FillInBlankTask) => void
}

const newId = () => crypto.randomUUID()

/** DOM → модель: id расставляются по позициям, чтобы ответы переживали правки текста. */
const syncSegments = (root: HTMLElement, segments: BlankSegment[]): BlankSegment[] =>
  reIdByPosition(segmentsFromDom(root), segments, newId)

/**
 * Редактор задачи «Пропуски»: один contentEditable-параграф, пропуска —
 * несъедобные чипы. Печать живёт только в DOM (uncontrolled), модель
 * синхронизируется дискретными событиями: blur параграфа, «Сделать
 * пропуском», операции с чипами. Между событиями React children не
 * перезаписывает DOM — курсор не скачет.
 */
export function FillInBlankEditor({ task, onChange }: FillInBlankEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [canBlank, setCanBlank] = useState(false)

  useEffect(() => {
    const update = () =>
      setCanBlank(selectionTarget(rootRef.current, window.getSelection()) !== null)
    document.addEventListener('selectionchange', update)

    return () => document.removeEventListener('selectionchange', update)
  }, [])

  /** Коммит набранного текста: DOM → модель (blur параграфа). */
  const commitText = () => {
    const root = rootRef.current
    if (root) onChange({ ...task, segments: syncSegments(root, task.segments) })
  }

  /** «Сделать пропуском»: сначала синхронизация DOM→модель, затем разрезка по выделению. */
  const makeBlankFromSelection = () => {
    const root = rootRef.current
    const target = selectionTarget(root, window.getSelection())
    if (!root || !target) return
    const synced = syncSegments(root, task.segments)
    if (synced[target.segIndex]?.blank !== null) return
    const next = makeBlank(synced, target.segIndex, target.start, target.end, newId())
    if (next === synced) return
    window.getSelection()?.removeAllRanges()
    onChange({ ...task, segments: next })
  }

  /** Убрать пропуск: текст сегмента сохраняется, невидимые пустые сегменты выбрасываются. */
  const removeBlankAt = (segmentId: string) => {
    const root = rootRef.current
    if (!root) return
    const synced = syncSegments(root, task.segments)
    const index = synced.findIndex((s) => s.id === segmentId)
    if (index === -1) return
    onChange({ ...task, segments: dropEmpty(removeBlank(synced, index)) })
  }

  /** Правка эталонного ответа чипа (инлайн-инпут). */
  const commitAnswer = (segmentId: string, answer: string) => {
    const root = rootRef.current
    if (!root) return
    const synced = syncSegments(root, task.segments)
    onChange({
      ...task,
      segments: synced.map((s) => (s.id === segmentId ? { ...s, blank: answer } : s)),
    })
  }

  return (
    <Field>
      <EditableText
        editing
        grow
        value={task.prompt}
        className="prompt"
        placeholder="Введите условие задачи…"
        onChange={(prompt) => onChange({ ...task, prompt })}
      />
      <SectionLabel>Заполните пропуски</SectionLabel>
      <Toolbar>
        <ToolbarButton
          type="button"
          disabled={!canBlank}
          onMouseDown={(e) => e.preventDefault()}
          onClick={makeBlankFromSelection}
        >
          Сделать пропуском
        </ToolbarButton>
      </Toolbar>
      <Paragraph
        ref={rootRef}
        $editable
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={commitText}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
      >
        {task.segments.map((seg) => (
          <Fragment key={seg.id}>
            {seg.text}
            {seg.blank !== null && (
              <BlankChip
                answer={seg.blank}
                onAnswerChange={(answer) => commitAnswer(seg.id, answer)}
                onRemove={() => removeBlankAt(seg.id)}
              />
            )}
          </Fragment>
        ))}
      </Paragraph>
    </Field>
  )
}
