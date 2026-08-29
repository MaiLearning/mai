import { Check, ChevronLeft, ChevronRight, CircleCheck, Eye, Pencil, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Spinner } from '@/app/theme/components/Spinner'
import type { PluginRenderProps } from '@/features/plugin/core/types'
import { TaskRenderer } from './core/registry'
import {
  type AnyTask,
  type CheckStatus,
  DIFFICULTY_LABEL,
  TASK_KIND_LABEL,
  type ViewMode,
} from './core/types'
import { type TaskSaveState, useTaskContent } from './lib/useTaskContent'
import {
  Badge,
  Body,
  BodyInner,
  EmptyState,
  EmptyText,
  Footer,
  FooterSide,
  GhostButton,
  Header,
  IconButton,
  KindBadge,
  MetaLeft,
  MetaRow,
  ModeButton,
  ModeToggle,
  PrimaryButton,
  Result,
  SpinnerWrap,
  Step,
  StepStrip,
  TaskNo,
  Viewer,
} from './viewer.style'

interface TaskViewerTasksProps {
  tasks: AnyTask[]
  initialMode?: ViewMode
  saveState: TaskSaveState
  onSave: () => void
}

/**
 * Оболочка просмотра набора задач: степ-полоса навигации, метаданные
 * (тип/сложность), переключатель «Прохождение/Редактор» и футер с проверкой.
 * Проверка ответов — визуальная заглушка, механизм проверки вне зоны дизайна.
 */
export function TaskViewerTasks({
  tasks,
  initialMode = 'solve',
  saveState,
  onSave,
}: TaskViewerTasksProps) {
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<ViewMode>(initialMode)
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>({})

  const task = tasks[index]
  const status = statuses[task.id] ?? 'idle'
  const editing = mode === 'edit'

  const stepState = (i: number) => {
    if (i === index) return 'current' as const

    const s = statuses[tasks[i].id]
    if (s === 'correct') return 'correct' as const
    if (s === 'incorrect') return 'incorrect' as const

    return 'idle' as const
  }

  const check = () => {
    setStatuses((prev) => ({ ...prev, [task.id]: 'correct' }))
  }

  const go = (dir: -1 | 1) => {
    setIndex((i) => Math.min(tasks.length - 1, Math.max(0, i + dir)))
  }

  return (
    <Viewer aria-label="Просмотр задач">
      <Header>
        <StepStrip role="tablist" aria-label="Навигация по задачам">
          {tasks.map((t, i) => {
            const st = stepState(i)

            return (
              <Step
                key={t.id}
                $state={st}
                role="tab"
                aria-selected={i === index}
                aria-label={`Задача ${i + 1}`}
                onClick={() => setIndex(i)}
              >
                {st === 'correct' ? (
                  <Check size={15} />
                ) : st === 'incorrect' ? (
                  <X size={15} />
                ) : (
                  i + 1
                )}
              </Step>
            )
          })}
        </StepStrip>

        <MetaRow>
          <MetaLeft>
            <TaskNo>
              Задача {index + 1}
              <span style={{ opacity: 0.4 }}> / {tasks.length}</span>
            </TaskNo>
            <KindBadge>{TASK_KIND_LABEL[task.kind]}</KindBadge>
            <Badge $tone={task.difficulty}>{DIFFICULTY_LABEL[task.difficulty]}</Badge>
          </MetaLeft>

          <ModeToggle role="group" aria-label="Режим отображения">
            <ModeButton type="button" $active={!editing} onClick={() => setMode('solve')}>
              <Eye size={15} /> Прохождение
            </ModeButton>
            <ModeButton type="button" $active={editing} onClick={() => setMode('edit')}>
              <Pencil size={15} /> Редактор
            </ModeButton>
          </ModeToggle>
        </MetaRow>
      </Header>

      <Body className="app-scroll">
        <BodyInner>
          <TaskRenderer task={task} mode={mode} status={editing ? 'idle' : status} />
        </BodyInner>
      </Body>

      <Footer>
        <FooterSide>
          <GhostButton type="button" disabled={index === 0} onClick={() => go(-1)}>
            <ChevronLeft size={18} /> Назад
          </GhostButton>
        </FooterSide>

        <FooterSide>
          {!editing && status !== 'idle' && (
            <Result $status={status}>
              <CircleCheck size={17} />
              {status === 'correct' ? 'Верно' : 'Есть ошибки'}
            </Result>
          )}
          {editing ? (
            <IconButton $active type="button" disabled={saveState === 'saving'} onClick={onSave}>
              <Check size={15} /> {saveState === 'saving' ? 'Сохранение…' : 'Сохранить'}
            </IconButton>
          ) : (
            <PrimaryButton type="button" onClick={check} disabled={status !== 'idle'}>
              <Check size={18} /> Проверить
            </PrimaryButton>
          )}
          <GhostButton type="button" disabled={index === tasks.length - 1} onClick={() => go(1)}>
            Вперёд <ChevronRight size={18} />
          </GhostButton>
        </FooterSide>
      </Footer>
    </Viewer>
  )
}

/**
 * TaskViewer — viewer плагина task: тянет контент ресурса через сущность
 * `task-plugin`, пустой набор предлагает начать с первой задачи.
 */
export function TaskViewer({ resourceId, onReady }: PluginRenderProps) {
  const { loading, tasks, setTasks, saveState, save } = useTaskContent(resourceId)

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    if (!loading) onReadyRef.current?.()
  }, [loading])

  if (loading) {
    return (
      <Viewer>
        <SpinnerWrap>
          <Spinner label="Загрузка задач" />
        </SpinnerWrap>
      </Viewer>
    )
  }

  if (tasks.length === 0) {
    return (
      <Viewer>
        <EmptyState>
          <EmptyText>В этом наборе пока нет задач</EmptyText>
          <GhostButton
            type="button"
            onClick={() =>
              setTasks([
                {
                  id: crypto.randomUUID(),
                  kind: 'SingleChoice',
                  prompt: '',
                  difficulty: 'easy',
                  choices: [{ id: 'a', text: '', correct: false }],
                },
              ])
            }
          >
            <Plus size={16} /> Добавить задачу
          </GhostButton>
        </EmptyState>
      </Viewer>
    )
  }

  return (
    <TaskViewerTasks
      key={resourceId}
      tasks={tasks}
      initialMode={tasks.length === 1 && tasks[0].prompt === '' ? 'edit' : 'solve'}
      saveState={saveState}
      onSave={() => void save()}
    />
  )
}
