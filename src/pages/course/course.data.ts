export type LessonType = 'video' | 'reading' | 'quiz' | 'exercise'
export type LessonStatus = 'done' | 'current' | 'todo'
export type CourseNode = {
  id: string
  title: string
  type: LessonType | 'section'
  status?: LessonStatus
  duration?: string
  children?: CourseNode[]
}

export type Course = {
  id: string
  title: string
  subtitle: string
  root: CourseNode[]
}

export const course: Course = {
  id: 'understanding-neural-networks',
  title: 'Understanding Neural Networks',
  subtitle: 'My self-built path from linear algebra to a working classifier.',
  root: [
    {
      id: 's1',
      title: '1 · Foundations',
      type: 'section',
      children: [
        {
          id: 'l1',
          title: 'Why neural networks?',
          type: 'reading',
          duration: '7 min',
          status: 'done',
        },
        {
          id: 's1a',
          title: 'Math you actually need',
          type: 'section',
          children: [
            {
              id: 'l2',
              title: 'Vectors & matrices',
              type: 'reading',
              duration: '10 min',
              status: 'done',
            },
            {
              id: 'l3',
              title: 'Derivatives & gradients',
              type: 'video',
              duration: '13 min',
              status: 'done',
            },
            {
              id: 'l4',
              title: 'Checkpoint: the math',
              type: 'quiz',
              duration: '5 min',
              status: 'done',
            },
          ],
        },
        {
          id: 'l5',
          title: 'The single neuron model',
          type: 'video',
          duration: '11 min',
          status: 'done',
        },
      ],
    },
    {
      id: 's2',
      title: '2 · Training a network',
      type: 'section',
      children: [
        { id: 'l6', title: 'The forward pass', type: 'video', duration: '14 min', status: 'done' },
        {
          id: 's2a',
          title: 'Backpropagation',
          type: 'section',
          children: [
            {
              id: 'l7',
              title: 'The chain rule, intuitively',
              type: 'reading',
              duration: '12 min',
              status: 'current',
            },
            {
              id: 'l8',
              title: 'Gradient descent step by step',
              type: 'video',
              duration: '16 min',
              status: 'todo',
            },
            {
              id: 'l9',
              title: 'Train a net by hand',
              type: 'exercise',
              duration: '25 min',
              status: 'todo',
            },
          ],
        },
        {
          id: 'l10',
          title: 'Checkpoint: training',
          type: 'quiz',
          duration: '6 min',
          status: 'todo',
        },
      ],
    },
    {
      id: 's3',
      title: '3 · Building for real',
      type: 'section',
      children: [
        {
          id: 'l11',
          title: 'Implement an MLP from scratch',
          type: 'exercise',
          duration: '35 min',
          status: 'todo',
        },
        {
          id: 'l12',
          title: 'Overfitting & regularization',
          type: 'reading',
          duration: '13 min',
          status: 'todo',
        },
        {
          id: 'l13',
          title: 'Capstone: a digit classifier',
          type: 'exercise',
          duration: '45 min',
          status: 'todo',
        },
      ],
    },
  ],
}

export function flattenLessons(value: Course) {
  const result: CourseNode[] = []
  const walk = (node: CourseNode) =>
    node.children?.length ? node.children.forEach(walk) : result.push(node)
  value.root.forEach(walk)
  return result
}

export function courseProgress(value: Course) {
  const lessons = flattenLessons(value)
  const done = lessons.filter((lesson) => lesson.status === 'done').length
  return { done, total: lessons.length, percent: Math.round((done / lessons.length) * 100) }
}
