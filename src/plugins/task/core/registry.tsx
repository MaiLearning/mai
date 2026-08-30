import type { ComponentType } from 'react'
import { FillInBlank } from '../tasks/FillInBlank'
import { Matching } from '../tasks/Matching'
import { MultipleChoice } from '../tasks/MultipleChoice'
import { OpenAnswer } from '../tasks/OpenAnswer'
import { Ordering } from '../tasks/Ordering'
import { SingleChoice } from '../tasks/single-choice/SingleChoice'
import { TrueFalse } from '../tasks/TrueFalse'
import type { AnyTask, TaskComponentProps, TaskKind } from './types'

/**
 * Внутренний реестр TaskViewer.
 * По типу задачи выбирает нужный компонент для отображения тела.
 */
const TASK_REGISTRY: Record<TaskKind, ComponentType<TaskComponentProps<any>>> = {
  SingleChoice,
  MultipleChoice,
  TrueFalse,
  Matching,
  Ordering,
  FillInBlank,
  OpenAnswer,
}

export function resolveTaskComponent(kind: TaskKind) {
  return TASK_REGISTRY[kind]
}

export function TaskRenderer(props: TaskComponentProps<AnyTask>) {
  const Component = resolveTaskComponent(props.task.kind)
  if (!Component) return null

  return <Component {...props} />
}
