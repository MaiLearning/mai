import type { CourseNode } from '../model/types'

/** Иерархия курса для сторис: 2 уровня, папки + ресурсы с бейджами. */
export const mockTree: CourseNode[] = [
  {
    id: 'folder-intro',
    type: 'folder',
    title: 'Введение в React',
    children: [
      {
        id: 'res-jsx',
        type: 'resource',
        title: 'JSX и компоненты',
        badge: '12 мин',
        badgeTone: 'accent',
      },
      {
        id: 'res-props',
        type: 'resource',
        title: 'Props и композиция',
        badge: '8 мин',
        badgeTone: 'accent',
      },
      {
        id: 'res-conditional',
        type: 'resource',
        title: 'Условный рендеринг',
        badge: '6 мин',
        badgeTone: 'info',
      },
    ],
  },
  {
    id: 'folder-hooks',
    type: 'folder',
    title: 'Хуки',
    children: [
      {
        id: 'res-usestate',
        type: 'resource',
        title: 'useState: управление состоянием',
        badge: '15 мин',
        badgeTone: 'accent',
      },
      {
        id: 'res-useeffect',
        type: 'resource',
        title: 'useEffect: побочные эффекты',
        badge: '20 мин',
        badgeTone: 'accent',
      },
      {
        id: 'folder-advanced-hooks',
        type: 'folder',
        title: 'Продвинутые хуки',
        children: [
          {
            id: 'res-usememo',
            type: 'resource',
            title: 'useMemo и useCallback',
            badge: 'Черновик',
            badgeTone: 'neutral',
          },
          {
            id: 'res-usereducer',
            type: 'resource',
            title: 'useReducer',
            badge: '10 мин',
            badgeTone: 'info',
          },
        ],
      },
    ],
  },
  {
    id: 'res-summary',
    type: 'resource',
    title: 'Итоги курса',
    badge: 'Финал',
    badgeTone: 'success',
  },
]

/** Пустое дерево — для empty state. */
export const emptyTree: CourseNode[] = []
