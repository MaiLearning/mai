import type { AnyTask, TaskKind } from '../core/types'

/**
 * Каркас новой задачи по типу: пустые поля для заполнения автором,
 * сложность — пресетная «Лёгкая». Используется шагом «+» и пустым состоянием.
 */
export function createTask(kind: TaskKind): AnyTask {
  const id = crypto.randomUUID()

  switch (kind) {
    case 'SingleChoice':
      return {
        id,
        kind,
        difficulty: 'easy',
        prompt: '',
        choices: [{ id: 'a', text: '', correct: true }],
      }
    case 'MultipleChoice':
      return {
        id,
        kind,
        difficulty: 'easy',
        prompt: '',
        choices: [
          { id: 'a', text: '', correct: true },
          { id: 'b', text: '', correct: false },
        ],
      }
    case 'TrueFalse':
      return { id, kind, difficulty: 'easy', prompt: '', answer: true }
    case 'Matching':
      return {
        id,
        kind,
        difficulty: 'easy',
        prompt: '',
        pairs: [
          { id: 'p1', left: '', right: '' },
          { id: 'p2', left: '', right: '' },
        ],
      }
    case 'Ordering':
      return {
        id,
        kind,
        difficulty: 'easy',
        prompt: '',
        items: [
          { id: 'i1', text: '' },
          { id: 'i2', text: '' },
        ],
      }
    case 'FillInBlank':
      return {
        id,
        kind,
        difficulty: 'easy',
        prompt: '',
        segments: [{ id: 's1', text: '', blank: null }],
      }
    case 'OpenAnswer':
      return { id, kind, difficulty: 'easy', prompt: '', sampleAnswer: '', placeholder: '' }
  }
}
