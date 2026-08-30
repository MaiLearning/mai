import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { TaskWorkspace } from './components/TaskWorkspace'
import { TaskRenderer } from './core/registry'
import type { AnyTask, CheckStatus, TaskKind, ViewMode } from './core/types'
import { sampleTasks } from './dev/sample-data'

/** Рамка с фиксированным размером: вьюер рассчитан на заполнение контейнера. */
const Frame = styled.div`
  width: 960px;
  height: 640px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

/** Галерея: все варианты задач подряд, как на ревью дизайна. */
const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 720px;
  padding: 40px 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.body};
`

const byKind = (kind: TaskKind): AnyTask =>
  sampleTasks.find((task) => task.kind === kind) ?? sampleTasks[0]

const renderKind = (kind: TaskKind, mode: ViewMode = 'solve', status: CheckStatus = 'idle') => {
  const task = byKind(kind)

  return <TaskRenderer key={`${kind}-${mode}-${status}`} task={task} mode={mode} status={status} />
}

const KINDS: TaskKind[] = [
  'SingleChoice',
  'MultipleChoice',
  'TrueFalse',
  'Matching',
  'Ordering',
  'FillInBlank',
  'OpenAnswer',
]

const meta = {
  title: 'Plugins/Task/TaskViewer',
  component: TaskWorkspace,
  tags: ['autodocs'],
  args: {
    tasks: sampleTasks,
    difficulties: [],
    answers: {},
    results: {},
    setTasks: () => {},
    setDifficulties: () => {},
    setAnswer: () => {},
    setResult: () => {},
    editTask: () => {},
    restartTask: () => {},
    initialMode: 'solve' as const,
    saveState: 'idle' as const,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Просмотр задач: степ-полоса навигации с шагом «создать задачу», метаданные ' +
          '(тип/сложность с редактором своих сложностей), режимы «Прохождение/Редактор», ' +
          'футер с навигацией, проверкой и индикатором автосохранения. ' +
          'Реальные 7 типов задач отрисовываются через TaskRenderer.',
      },
    },
  },
} satisfies Meta<typeof TaskWorkspace>

export default meta
type Story = StoryObj<typeof meta>

/** Полный вьюер с демо-набором задач: навигация, «Проверить», переключение в редактор. */
export const Solve: Story = {
  render: (args) => (
    <Frame>
      <TaskWorkspace {...args} />
    </Frame>
  ),
}

/** Все типы задач в режиме прохождения. */
export const GallerySolve: Story = {
  render: () => <Gallery>{KINDS.map((kind) => renderKind(kind))}</Gallery>,
}

/** Все типы задач в режиме редактора (WYSIWYG-поля, бейджи «Верный», кнопки удаления). */
export const GalleryEdit: Story = {
  render: () => <Gallery>{KINDS.map((kind) => renderKind(kind, 'edit'))}</Gallery>,
}

/** Визуальные состояния проверки: correct и incorrect для разных типов. */
export const GalleryCheckStates: Story = {
  render: () => (
    <Gallery>
      {renderKind('SingleChoice', 'solve', 'correct')}
      {renderKind('TrueFalse', 'solve', 'incorrect')}
      {renderKind('Ordering', 'solve', 'correct')}
      {renderKind('OpenAnswer', 'solve', 'correct')}
      {renderKind('FillInBlank', 'solve', 'incorrect')}
    </Gallery>
  ),
}
