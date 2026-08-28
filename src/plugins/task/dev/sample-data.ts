import type { AnyTask } from '../core/types'

/** Демонстрационный набор задач, покрывающий все варианты реестра. */
export const sampleTasks: AnyTask[] = [
  {
    id: 't1',
    kind: 'SingleChoice',
    difficulty: 'easy',
    prompt: 'Какая асимптотическая сложность у бинарного поиска в отсортированном массиве?',
    choices: [
      { id: 'a', text: 'O(1)', correct: false },
      { id: 'b', text: 'O(log n)', correct: true },
      { id: 'c', text: 'O(n)', correct: false },
      { id: 'd', text: 'O(n log n)', correct: false },
    ],
  },
  {
    id: 't2',
    kind: 'MultipleChoice',
    difficulty: 'medium',
    prompt: 'Какие из перечисленных алгоритмов сортировки являются устойчивыми (stable)?',
    choices: [
      { id: 'a', text: 'Сортировка слиянием (Merge sort)', correct: true },
      { id: 'b', text: 'Быстрая сортировка (Quick sort)', correct: false },
      { id: 'c', text: 'Сортировка вставками (Insertion sort)', correct: true },
      { id: 'd', text: 'Пирамидальная сортировка (Heap sort)', correct: false },
    ],
  },
  {
    id: 't3',
    kind: 'TrueFalse',
    difficulty: 'easy',
    prompt: 'Обход графа в глубину (DFS) можно реализовать с помощью стека.',
    answer: true,
  },
  {
    id: 't4',
    kind: 'Matching',
    difficulty: 'medium',
    prompt: 'Сопоставьте структуру данных с операцией, которую она выполняет за O(1) в среднем.',
    pairs: [
      { id: 'p1', left: 'Хеш-таблица', right: 'Поиск по ключу' },
      { id: 'p2', left: 'Стек', right: 'Добавление на вершину' },
      { id: 'p3', left: 'Очередь', right: 'Извлечение из начала' },
    ],
  },
  {
    id: 't5',
    kind: 'Ordering',
    difficulty: 'hard',
    prompt: 'Расставьте шаги алгоритма Дейкстры в правильном порядке.',
    items: [
      { id: 'i1', text: 'Инициализировать расстояния бесконечностью, старт — нулём' },
      { id: 'i2', text: 'Выбрать непосещённую вершину с минимальным расстоянием' },
      { id: 'i3', text: 'Обновить расстояния до соседей (релаксация)' },
      { id: 'i4', text: 'Пометить вершину как посещённую' },
    ],
  },
  {
    id: 't6',
    kind: 'FillInBlank',
    difficulty: 'medium',
    prompt: 'Заполните пропуски в утверждении о сложности.',
    segments: [
      { id: 's1', text: 'Быстрая сортировка в среднем работает за ', blank: 'O(n log n)' },
      { id: 's2', text: ', но в худшем случае деградирует до ', blank: 'O(n^2)' },
      { id: 's3', text: '.', blank: null },
    ],
  },
  {
    id: 't7',
    kind: 'OpenAnswer',
    difficulty: 'hard',
    prompt:
      'Объясните своими словами, почему пирамидальная сортировка гарантирует O(n log n) в худшем случае.',
    placeholder: 'Введите развёрнутый ответ…',
    sampleAnswer:
      'Построение кучи занимает O(n), а затем n раз извлекается максимум с просеиванием за O(log n), что суммарно даёт O(n log n) независимо от исходных данных.',
  },
]
