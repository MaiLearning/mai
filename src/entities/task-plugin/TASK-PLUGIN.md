# TASK-PLUGIN — руководство сущности

> Руководство «для чайников»: что делает сущность, как ею пользоваться
> (примеры кода), как расширять.

## Что делает

Сущность `task-plugin` — фронтовый слой контента заданий для in-app
плагина `src/plugins/task`. Хранит задачи ресурса в таблице `task`
(backend), валидирует wire-контракт Zod-схемами и отдаёт его плагину
и viewer'у.

- **Wire-контракт** (`core/schema.ts`) — источник истины: 7 типов задач
  (`SingleChoice`, `MultipleChoice`, `TrueFalse`, `Matching`, `Ordering`,
  `FillInBlank`, `OpenAnswer`), discriminated union по полю `kind`.
  Плагин (`src/plugins/task/core/types.ts`) реэкспортирует типы отсюда —
  дублирования контракта нет.
- **Сложности**: `task.difficulty` — id (строка). Пресеты `easy`/`medium`/
  `hard` фиксированы на стороне плагина; свои сложности автор задаёт в
  `TaskContent.difficulties: CustomDifficulty[]` (`{id, label, color}`).
  Ссылка на удалённую сложность не ломает парсинг — viewer рисует
  fallback-бейдж.
- **Контент ресурса** — `TaskContent { tasks, difficulties, answers, results, completed }`. Backend держит
  его как opaque JSON; дефолт `{}` разворачивается в
  `{ tasks: [], difficulties: [], answers: {}, results: {}, completed: {} }` через `.default(...)`.
- **Ответы и результаты** — прохождение живёт в том же контенте:
  `answers: Record<id задачи, TaskAnswer>` (форма ответа — union по `kind`
  задачи: выбор/набор/да-нет/сопоставление/порядок/пропуски/текст) и
  `results: Record<id задачи, 'correct' | 'incorrect'>`. Отсутствие записи
  = задача не решалась. Backend не знает про форму ответов (opaque JSON).
- **Транспорт** — Tauri IPC (`get/save/clear/delete_task_content`),
  fake-ветки нет (контент осмыслен только с backend'ом).

## Как пользоваться

Через публичные экспорты корня (`@/entities/task-plugin`): типы
(`AnyTask`, `TaskContentData`, …) и store-атомы.

```ts
import { useAtomValue, useSetAtom } from 'jotai'
import {
  loadTaskContentAtom, saveTaskContentAtom,
  clearTaskContentAtom, deleteTaskContentAtom,
  taskContentsAtom,
} from '@/entities/task-plugin'

// подписка на содержимое (все ресурсы в списке)
const contents = useAtomValue(taskContentsAtom)
const tasks = contents.find((c) => c.resourceId === resourceId)?.content.tasks ?? []

// операции — action-атомы
const load = useSetAtom(loadTaskContentAtom)
const save = useSetAtom(saveTaskContentAtom)

useEffect(() => { void load(resourceId) }, [resourceId, load])

await save({ resourceId, content: { tasks } })   // → TaskContentData
await clear(resourceId)                          // → { tasks: [] }
await remove(resourceId)                         // строка удалена
```

Каждая операция валидирует ответ backend'а через Zod — битый контент
не пройдёт дальше сервиса.

Viewer-использование (прецедент): `TaskViewer` в `src/plugins/task`
тянет контент напрямую через сервис `fetchTaskContent` в хуке
`lib/useTaskContent` (как theory: редактируемое состояние — локальное).
Кнопки «Сохранить» нет: любое изменение (задачи, сложности, ответы,
результаты) ставит отложенное автосохранение всего контента — обобщённый
хук `lib/useAutosave` (debounce ~800 мс, финальный сейв при уходе,
индикатор-точка в футере воркспейса). Проверка ответов — `lib/check.ts`
плагина, по union-форме ответа.

## Жизненный цикл прохождения

Чистые редьюсеры — `src/plugins/task/lib/content.ts` (с тестами);
проводка — `useTaskContent` + `TaskWorkspace`:

| Событие | Ответ | Результат | `completed` |
|---|---|---|---|
| Проверка (`withResult`) | фиксируется | ставится | `true` (верно/неверно — неважно) |
| «Пройти заново» (`withRestart`) | стирается — снова «не решалась» | удаляется | **остаётся** |
| Правка содержания задачи (`withTaskEdited`) | удаляется | удаляется | **сброс** — задача снова непройдена |
| Правка только сложности | не трогается | не трогается | не трогается (метаданные) |

Пока стоит результат, ответ зафиксирован: интеракции компонента задачи
заблокированы (гард `locked = !editing && status !== 'idle'`, у dnd —
отключение listeners), в футере вместо «Проверить» — «Пройти заново».
Старый контент без флагов дополняется при загрузке: `backfillCompleted`
(есть `results[taskId]` ⇒ `completed[taskId] = true`, на диск попадает со
следующей мутацией).

## Как расширять

- **Новый тип задачи**: добавить схему в `core/schema.ts`
  (объект с `kind: z.literal(...)` поверх `BaseTaskShape`) → включить в
  `TaskSchema`; схему ответа — в `TaskAnswerSchema`; типы в `core/model.ts`;
  реэкспорт в `src/plugins/task/core/types.ts`; компонент тела — в
  директорию `src/plugins/task/tasks/<имя-типа>/` и реестр
  `src/plugins/task/core/registry.tsx`; ветка проверки — `lib/check.ts`
  плагина. Backend не меняется (opaque JSON).
- **Новое поле у задач**: дополнить `BaseTaskShape` или конкретную схему;
  Zod-схема — единственное место правки контракта.
- **Новая операция**: api (`invoke`) → service (Zod-parse входа/выхода) →
  action-атом; по образцу `services/fetch.ts` + `store/fetch.ts`.
- **Проверки контракта**: `core/schema.test.ts` — при изменении схем
  добавь кейс нового типа/поля.
