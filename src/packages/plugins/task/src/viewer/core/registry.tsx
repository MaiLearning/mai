import type { ComponentType } from 'react'
import { FillInBlank } from '../tasks/fill-in-blank/FillInBlank'
import { Matching } from '../tasks/matching/Matching'
import { MultipleChoice } from '../tasks/multiple-choice/MultipleChoice'
import { OpenAnswer } from '../tasks/open-answer/OpenAnswer'
import { Ordering } from '../tasks/ordering/Ordering'
import { SingleChoice } from '../tasks/single-choice/SingleChoice'
import { TrueFalse } from '../tasks/true-false/TrueFalse'
import type { AnyTask, TaskComponentProps, TaskKind } from './types'

/**
 * Внутренний реестр TaskViewer.
 * По типу задачи выбирает нужный компонент для отображения тела.
 */
const TASK_REGISTRY: Record<TaskKind, ComponentType<TaskComponentProps<any, any>>> = {
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
