# TASK-PLUGIN — руководство сущности

> Руководство «для чайников»: что делает сущность, как ею пользоваться
> (примеры кода), как расширять.

## Что делает

Сущность `task-plugin` — фронтовый слой контента заданий для in-app
плагина `src/plugins/task`. Backend хранит задачи **реляционно**
(отдельные таблицы задач, сложностей, ответов, результатов и попыток);
сущность держит их зеркальную wire-модель и гоняет гранулярные
Tauri-команды. Обратно-совместимости со старым opaque-JSON нет.

- **Wire-контракт** (`core/schema.ts`) — источник истины: 7 типов задач
  (`SingleChoice`, `MultipleChoice`, `TrueFalse`, `Matching`, `Ordering`,
  `FillInBlank`, `OpenAnswer`), discriminated union по полю `kind`.
  Плагин (`src/plugins/task/core/types.ts`) реэкспортирует типы отсюда —
  дублирования контракта нет.
- **Сложности**: `task.difficulty` — id (строка). Пресеты `easy`/`medium`/
  `hard` фиксированы на стороне плагина; свои сложности автор задаёт в
  `TaskContent.difficulties: CustomDifficulty[]` (`{id, label, color}`)
  и сохраняет отдельной командой `set_task_difficulties` (полная замена
  набора). Ссылка на удалённую сложность не ломает парсинг — viewer
  рисует fallback-бейдж.
- **Контент ресурса** — `TaskContent
  { tasks, difficulties, answers, results, completed }`; поставляется
  целиком снапшотом `TaskSnapshotData
  { resourceId, content, createdAt, updatedAt }` (команда
  `task_snapshot`). Дефолт backend `{}` разворачивается в пустые списки
  и словари через `.default(...)`.
- **Прохождение** — `answers: Record<id задачи, TaskAnswer>` (форма
  ответа — union по `kind` задачи), `results: Record<id задачи,
  'correct' | 'incorrect'>`, `completed: Record<id задачи, true>`.
  Отсутствие записи = задача не решалась. Форму ответов backend знает
  (реляционные таблицы), валидация на фронте — те же Zod-схемы.
- **История попыток** — backend пишет попытку при каждой проверке
  (`set_task_result`): `TaskAttempt {id, taskId, seq, answer | null,
  result, checkedAt}`. Читается командой `list_task_attempts`; фронт
  пока попытки не использует (задел).
- **Дефолты задач** — генерирует backend: `create_task` возвращает
  готовую задачу с uuid и пустыми полями под тип (у фронта фабрики
  задач больше нет).

## Команды (Tauri IPC)

| Команда | Вход | Выход | Заметки |
|---|---|---|---|
| `task_snapshot` | `{resourceId}` | `TaskSnapshotData` | весь контент ресурса разом |
| `create_task` | `{resourceId, kind}` | `Task` | uuid + дефолты — на backend |
| `update_task_content` | `{taskId, task}` | — | замена определения; прогресс прохождения задачи сбрасывается |
| `update_task_difficulty` | `{taskId, difficulty}` | — | метаданные, прогресс не трогается |
| `delete_task` | `{taskId}` | — | задача уходит с прогрессом |
| `set_task_difficulties` | `{resourceId, difficulties}` | — | полная замена набора своих сложностей |
| `submit_task_answer` | `{taskId, answer}` | — | ответ без проверки |
| `set_task_result` | `{taskId, answer: TaskAnswer \| null, result}` | — | ответ + результат + `completed` + запись попытки в историю |
| `restart_task` | `{taskId}` | — | ответ и результат стираются, `completed` остаётся |
| `list_task_attempts` | `{taskId}` | `TaskAttempt[]` | история проверок |

Входы команд валидируются схемами `*InputSchema`; ответы — схемами
моделей. Fake-ветки нет (контент осмыслен только с backend'ом).

## Как пользоваться

Через публичные экспорты корня (`@/entities/task-plugin`): типы
(`AnyTask`, `TaskSnapshotData`, …) и store-атомы.

```ts
import { useAtomValue, useSetAtom } from 'jotai'
import {
  loadTaskSnapshotAtom, createTaskAtom, deleteTaskAtom,
  updateTaskContentAtom, updateTaskDifficultyAtom,
  submitTaskAnswerAtom, setTaskResultAtom, restartTaskAtom,
  setTaskDifficultiesAtom,
  taskSnapshotsAtom,
} from '@/entities/task-plugin'

// подписка на снапшоты (по id ресурса)
const snapshots = useAtomValue(taskSnapshotsAtom)
const tasks = snapshots[resourceId]?.content.tasks ?? []

// операции — action-атомы
const load = useSetAtom(loadTaskSnapshotAtom)
const create = useSetAtom(createTaskAtom)

useEffect(() => { void load(resourceId) }, [resourceId, load])

const task = await create({ resourceId, kind: 'TrueFalse' })  // → AnyTask
```

Каждая операция валидирует вход и ответ backend'а через Zod — битые
данные не проходят дальше сервиса.

Viewer-использование (прецедент): `TaskViewer` в `src/plugins/task`
тянет снапшот напрямую через сервис `fetchTaskSnapshot` в хуке
`lib/useTaskContent` (как theory: редактируемое состояние — локальное).
Кнопки «Сохранить» нет: каждая операция оптимистично меняет локальное
зеркало и отправляет гранулярную команду через конвейер
`lib/useSavePipeline` (коалесция однотипных операций, сериализация
запросов, индикатор-точка в футере воркспейса). Проверка ответов —
`lib/check.ts` плагина, по union-форме ответа.

## Жизненный цикл прохождения

Локальные редьюсеры — `src/plugins/task/lib/content.ts` (с тестами);
та же семантика дублируется на backend'е (сознательное зеркалирование —
локальный UI не ждёт IPC). Проводка — `useTaskContent` + `TaskWorkspace`:

| Событие | Ответ | Результат | `completed` |
|---|---|---|---|
| Проверка (`withResult` / `set_task_result`) | фиксируется | ставится | `true` (верно/неверно — неважно) |
| «Пройти заново» (`withRestart` / `restart_task`) | стирается — снова «не решалась» | удаляется | **остаётся** |
| Правка содержания (`withTaskEdited` / `update_task_content`) | удаляется | удаляется | **сброс** — задача снова непройдена |
| Правка только сложности (`update_task_difficulty`) | не трогается | не трогается | не трогается (метаданные) |

Пока стоит результат, ответ зафиксирован: интеракции компонента задачи
заблокированы (гард `locked = !editing && status !== 'idle'`, у dnd —
отключение listeners), в футере вместо «Проверить» — «Пройти заново».

## Как расширять

- **Новый тип задачи**: добавить схему в `core/schema.ts`
  (объект с `kind: z.literal(...)` поверх `BaseTaskShape`) → включить в
  `TaskSchema`; схему ответа — в `TaskAnswerSchema`; дефолт creation —
  на backend'е; типы в `core/model.ts`; реэкспорт в
  `src/plugins/task/core/types.ts`; компонент тела — в директорию
  `src/plugins/task/tasks/<имя-типа>/` и реестр
  `src/plugins/task/core/registry.tsx`; ветка проверки — `lib/check.ts`
  плагина.
- **Новое поле у задач**: дополнить `BaseTaskShape` или конкретную схему;
  Zod-схема — единственное место правки контракта.
- **Новая команда**: api (`invoke`) → service (Zod-parse входа/выхода) →
  action-атом; по образцу `services/tasks.ts` + `store/tasks.ts`.
- **Проверки контракта**: `core/schema.test.ts` — при изменении схем
  добавь кейс нового типа/поля; сервисные тесты — рядом с сервисами
  (`services/*.test.ts`).
