import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { AnyTask, CustomDifficulty, TaskKind, ViewMode } from '../core/types'
import { TASK_KIND_LABEL } from '../core/types'
import { difficultyColor, difficultyTone, resolveDifficulty } from '../lib/difficulties'
import {
  Badge,
  DeleteTaskButton,
  Header,
  KindBadge,
  MetaLeft,
  MetaRow,
  ModeButton,
  ModeToggle,
  TaskNo,
} from '../viewer.style'
import { DifficultyPicker } from './DifficultyPicker'
import { TaskStepper } from './TaskStepper'

interface WorkspaceHeaderProps {
  tasks: AnyTask[]
  index: number
  task: AnyTask
  mode: ViewMode
  difficulties: CustomDifficulty[]
  stepState: (i: number) => 'idle' | 'current' | 'correct' | 'incorrect'
  onSelect: (i: number) => void
  onSetMode: (mode: ViewMode) => void
  onUpdateTask: (id: string, patch: Partial<AnyTask>) => void
  onSetDifficulties: (next: CustomDifficulty[]) => void
  onDelete: (taskId: string) => void
  onCreate: (kind: TaskKind) => void
}

/** Шапка воркспейса: степ-полоса, метаданные (тип/сложность/удаление), режимы. */
export function WorkspaceHeader({
  tasks,
  index,
  task,
  mode,
  difficulties,
  stepState,
  onSelect,
  onSetMode,
  onUpdateTask,
  onSetDifficulties,
  onDelete,
  onCreate,
}: WorkspaceHeaderProps) {
  const editing = mode === 'edit'
  const view = resolveDifficulty(task.difficulty, difficulties)

  return (
    <Header>
      <TaskStepper
        tasks={tasks}
        index={index}
        stepState={stepState}
        onSelect={onSelect}
        onCreate={onCreate}
      />

      <MetaRow>
        <MetaLeft>
          <TaskNo>
            Задача {index + 1}
            <span style={{ opacity: 0.4 }}> / {tasks.length}</span>
          </TaskNo>
          <KindBadge>{TASK_KIND_LABEL[task.kind]}</KindBadge>
          {editing ? (
            <>
              <DifficultyPicker
                value={task.difficulty}
                difficulties={difficulties}
                onChange={(id) => onUpdateTask(task.id, { difficulty: id })}
                onChangeDifficulties={onSetDifficulties}
              />
              <DeleteTaskButton
                type="button"
                aria-label="Удалить задачу"
                title="Удалить задачу"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 size={15} />
              </DeleteTaskButton>
            </>
          ) : (
            <Badge $tone={difficultyTone(view) ?? 'default'} $color={difficultyColor(view)}>
              {view?.label ?? 'Без сложности'}
            </Badge>
          )}
        </MetaLeft>

        <ModeToggle role="group" aria-label="Режим отображения">
          <ModeButton type="button" $active={!editing} onClick={() => onSetMode('solve')}>
            <Eye size={15} /> Прохождение
          </ModeButton>
          <ModeButton type="button" $active={editing} onClick={() => onSetMode('edit')}>
            <Pencil size={15} /> Редактор
          </ModeButton>
        </ModeToggle>
      </MetaRow>
    </Header>
  )
}
