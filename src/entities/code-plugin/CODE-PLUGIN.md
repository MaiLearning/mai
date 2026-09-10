# CODE-PLUGIN — руководство сущности

> Руководство «для чайников»: что делает сущность, как ею пользоваться
> (примеры кода), как расширять.

## Что делает

Сущность `code-plugin` — фронтовый слой контента уроков-кодов для
in-app плагина `code` (его UI живёт в `src/plugins/code`). Backend
хранит контент **opaque-JSON** при ресурсе (как theory, а не реляционно
как task); сущность фиксирует его структуру Zod-схемами и гоняет три
Tauri-команды.

- **Урок** — набор шагов `CodeStep {id, title, instructions,
  starterCode, expectedOutput}` и язык `language: 'python' |
  'javascript'`. Границы полей: `title` до 200 (может быть пустым —
  отображается с фолбэком «Шаг N»), `instructions` до 5000,
  `starterCode`/`expectedOutput`/код запуска до 100 000 символов —
  константы `MAX_*` экспортируются из `core/schema.ts` и вшиты в схемы.
- **Прохождение** — `code: Record<id шага, код ученика>` и
  `results: Record<id шага, 'passed' | 'failed'>`. Отсутствие записи в
  `results` — шаг ещё не проверялся. Проверка — на фронте (`lib/check.ts`
  плагина): сравнение stdout исполнения с `expectedOutput` с обрезкой
  пробелов по краям и код выхода 0.
- **Контент ресурса** — `CodeLessonContent {language, steps, code,
  results}`; поставляется целиком снапшотом `CodeContentData
  {resourceId, content, createdAt, updatedAt}`. Дефолт backend `{}`
  разворачивается в `{language: 'python', steps: [], code: {}, results:
  {}}` через `.default(...)`.
- **Запуск** — `code_run` исполняет код ученика в выбранном языке и
  возвращает `CodeRunResult {stdout, stderr, exitCode (nullable),
  timedOut, durationMs}`. `timedOut: true` — процесс прерван по
  таймауту; тогда `exitCode` обычно `null`.
- **Сохранение** — контент уходит **целиком** (`update_code_content`),
  гранулярных команд нет: backend не знает структуру контента.
  Backend в ответе отдаёт свежий снапшот (его `updatedAt` — истина).

## Команды (Tauri IPC)

| Команда | Вход | Выход | Заметки |
|---|---|---|---|
| `code_snapshot` | `{resourceId}` | `CodeContentData` | весь контент ресурса разом; дефолт `{}` разворачивается схемой |
| `update_code_content` | `{resourceId, content}` | `CodeContentData` | полная замена контента; ответ — свежий снапшот |
| `code_run` | `{language, code}` | `CodeRunResult` | запуск без привязки к ресурсу — pure-исполнение |

Входы команд валидируются схемами `*InputSchema`; ответы — схемами
моделей. Fake-ветки нет (контент осмыслен только с backend'ом, как в
task-plugin).

## Как пользоваться

Через публичные экспорты корня (`@/entities/code-plugin`): типы
(`CodeLessonContent`, `CodeStep`, `CodeContentData`, `CodeRunResult`,
…) и store-атомы.

```ts
import { useAtomValue, useSetAtom } from 'jotai'
import {
  loadCodeSnapshotAtom, saveCodeContentAtom, runCodeAtom,
  codeSnapshotsAtom,
} from '@/entities/code-plugin'

// подписка на снапшоты (по id ресурса)
const snapshots = useAtomValue(codeSnapshotsAtom)
const content = snapshots[resourceId]?.content
const steps = content?.steps ?? []

// операции — action-атомы
const load = useSetAtom(loadCodeSnapshotAtom)
const save = useSetAtom(saveCodeContentAtom)
const run = useSetAtom(runCodeAtom)

useEffect(() => { void load(resourceId) }, [resourceId, load])

// сохранение целиком; возвращает свежий снапшот
const snapshot = await save({ resourceId, content: { ...content, steps: nextSteps } })

// запуск без стейта — результат обрабатывает вызывающий
const result = await run({ language: 'python', code: 'print("hello")' })
// result.stdout / result.exitCode / result.timedOut
```

Каждая операция валидирует вход и ответ backend'а через Zod — битые
данные не проходят дальше сервиса.

## Как расширять

- **Новый язык**: добавить значение в `CodeLanguageSchema` — единственное
  место правки контракта (backend-валидацию добавить там отдельно).
- **Новое поле шага/урока**: дополнить `CodeStepSchema` или
  `CodeLessonContentSchema` (при необходимости с `.default(...)`, чтобы
  старый opaque-JSON продолжал парситься); типы в `core/model.ts`.
- **Новая команда**: api (`invoke`) → service (Zod-parse входа/выхода) →
  action-атом; по образцу `services/run.ts` + `store/run.ts`.
- **Проверки контракта**: `core/schema.test.ts` — при изменении схем
  добавь кейс нового поля; сервисные тесты — рядом с сервисами
  (`services/*.test.ts`).
