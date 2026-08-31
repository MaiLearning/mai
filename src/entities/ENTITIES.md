# Entities — Mai frontend

Сущности (`src/entities/<name>/`): `course`, `directory`, `kv`, `plugins`,
`resource`, `structure`, `task-plugin`, `theory-plugin`.
Каждая следует структуре `{core, api, services, store, index.ts}`
(исключение: `kv` — без `store`).

## Структура сущности

- **core/** — wire-контракт: Zod-схемы (`schema.ts`), выведенные TS-типы
  (`model.ts` через `z.infer`), константы, rules, exceptions по мере
  необходимости. Не зависит ни от чего остального.
- **api/** — транспорт: Tauri `invoke()`-команды + ветка fake-storage.
  Чистые функции, без валидации.
- **services/** — слой use-cases: вызывает `api`, валидирует каждый
  результат через Zod (`Schema.parse`). Unit-тесты лежат рядом
  (`*.test.ts`).
- **store/** — Jotai: `atoms.ts` (атомы состояния) + файлы операций
  (`fetch.ts`, `create.ts`, `update.ts`, `delete.ts`) с асинхронными
  **action atoms**.
- **index.ts** — реэкспортирует **только** `core` + `store` (kv: `core` +
  `services`). `api/` и `services/` — внутренние: фичи их не импортируют.

## Корневые реэкспорты (`src/entities/index.ts`)

- Плоско (`export *`): `course`, `plugins`, `resource`, `task-plugin`,
  `theory-plugin`.
- С неймспейсом (`export * as <name>`): `directory`, `structure`.
- `kv` из корня не реэкспортируется — импортировать напрямую через
  `@/entities/kv`.

## Руководства сущностей

У каждой сущности есть своё `<ENTITY>.md` — руководство «для чайников»:
что сущность делает, как ею пользоваться (примеры кода), как расширять.
Руководства заполняются постепенно; отсутствующие — заглушки.

## Сущности

### course
Учебный курс: `{id, name, description?, tags[], colorFrom?, colorTo?,
status: draft | in_progress | completed, createdAt, updatedAt}`
(таймстампы в мс).
State: `coursesAtom`, `selectedCourseIdAtom`, `coursesByIdAtom`
(точечный кэш, наполняется через `loadCourseByIdAtom`), мемоизированная
фабрика `selectCourseAtom(courseId)` (один атом на id — стабильная
ссылка для хуков), derived `selectedCourseAtom`. Операции:
`loadCoursesAtom`, `loadCourseByIdAtom`. Services также отдают
статистику тегов (`TagStat`).

### directory
Папка внутри курса, группирует узлы structure:
`{id, courseId, name, createdAt, updatedAt}`.
Входы: `CreateDirectoryInput` (с nullable `parentId`),
`RenameDirectoryInput` (`nodeId` + `name`).
State: `directoriesAtom` + операции create/delete/update/fetch.
Из корня экспортируется **с неймспейсом**.

### kv
Универсальное key-value хранилище. Правила ключа зеркалят валидацию
бэкенда (`src-tauri/services/kv/rules.rs`): только `[a-zA-Z0-9._:/-]`,
до 256 символов (`MAX_KEY_LENGTH`).
`KvEntry {key, value: unknown, createdAt, updatedAt}` — camelCase, как
отдаёт serde. **Store нет**: только services `get`/`set`; публичная
поверхность — `core` + `services`.

### plugins
Реестр установленных плагинов:
`Plugin {id, name, author?, description?, version, enabled,
kind: internal | external, installedAt, updatedAt}`.
`PluginManifest {id, name, version, main, description?, author?,
resources?}`.
Входы: `RegisterPluginInput` (external, несёт `code` плагина +
`sdkVersion`), `RegisterInternalPluginInput`, `SetPluginEnabledInput`.
State: `pluginsAtom` + операции.

### resource
Материалы курса и их типы.
`ResourceType {key, name, description?, pluginId?, supportedExtensions[],
createdAt, updatedAt}`.
`Resource {id, courseId, typeKey?, name, metadata: unknown, files[],
createdAt, updatedAt}`.
State: `resourcesAtom`, `resourceTypesAtom` + операции.

### structure
Дерево содержимого курса; хранится плоско, собирается по
`parentId`/`position`:
`StructureNode {id, courseId, parentId?, position, isDirectory,
resource? — полный встроенный Resource, directoryId?, name}`;
`Structure {courseId, nodes[]}`.
Входы: `CreateStructureResourceInput`, `MoveStructureNodeInput`.
State: SSOT — `structureTreeAtom` (иммутабельное дерево, модуль
`tree/`) + `structureFlatByIdAtom` (payload-оригиналы узлов);
потребители читают производную плоскую проекцию
`structureNodesAtom: StructureNodeFlat[]` и реактивные
`canUndoAtom`/`canRedoAtom`. Операции: `loadStructureAtom`,
`createDirectoryAtom`, `createResourceAtom`, `moveNodeAtom`,
`renameNodeAtom`, `deleteNodeAtom`, `undoStructureAtom`,
`redoStructureAtom`. Мутации optimistic (кроме создания —
backend-first), при ошибке backend автоматический откат; undo/redo —
backend-first (подробности в `STRUCTURE.md`). Иерархию валидирует и
оптимистично применяет History-машина (`store/history.ts` +
`store/actions.ts` на основе `tree/Tree`); переименование идёт через
directory-сервис для любых узлов. Из корня экспортируется
**с неймспейсом**.

### task-plugin
Контент заданий, привязанный к ресурсу (wire-контракт in-app плагина
`src/plugins/task`); backend хранит его реляционно, команды —
гранулярные. `AnyTask` — discriminated union по `kind` (7 типов:
`SingleChoice`, `MultipleChoice`, `TrueFalse`, `Matching`, `Ordering`,
`FillInBlank`, `OpenAnswer`); база — `id`, `prompt`, `difficulty`
(`easy|medium|hard`). Типы задач: выбор (`choices[]` с флагом `correct`),
`TrueFalse` (`answer`), сопоставление (`pairs[]`), порядок (`items[]`),
пропуски (`segments[]` с `blank: string | null`), свободный ответ
(`sampleAnswer`, `placeholder`).
`TaskContent {tasks, difficulties, answers, results, completed}`,
снапшот `TaskSnapshotData {resourceId, content, createdAt, updatedAt}`,
попытки `TaskAttempt {id, taskId, seq, answer|null, result, checkedAt}`,
входы команд (`*InputSchema`). Zod-схемы (`core/schema.ts`) — источник
истины; плагин реэкспортирует типы из сущности. API — Tauri IPC
`task_snapshot`, `create/update/delete_task`, `update_task_difficulty`,
`set_task_difficulties`, `submit_task_answer`, `set_task_result`,
`restart_task`, `list_task_attempts`, без fake-ветки (как theory).
State: `taskSnapshotsAtom` (по id ресурса); операции `loadTaskSnapshotAtom`,
`createTaskAtom`, `updateTaskContentAtom`, `updateTaskDifficultyAtom`,
`deleteTaskAtom`, `setTaskDifficultiesAtom`, `submitTaskAnswerAtom`,
`setTaskResultAtom`, `restartTaskAtom` (подробности в `TASK-PLUGIN.md`).

### theory-plugin
Теория, привязанная к ресурсу:
`TheoryContent {resourceId, content: Record<string, unknown>,
createdAt, updatedAt}`, `SaveTheoryContentInput`.
State: `theoryContentsAtom`.
In-app просмотрщик живёт в `src/plugins/theory` (`TheoryViewer`).

## Fake-storage toggle

`utils/fake-entities-storage` — `isFakeDataEnabled = appConfig.mode ===
'development' && appConfig.fakeData` (конфиг приходит из
`virtual:mai-config`, т.е. `config/{development,production,release}.conf`).
Каждая `api`-функция первой проверяет флаг: при `true` отдаёт данные из
`fakeState`, иначе вызывает Tauri-команду. Переключение real/fake
бэкенда — изменение одного флага.

## Конвенция потока данных

```
feature/page
  → store action atom (например loadCoursesAtom)
    → service (Zod-валидация)
      → api (fakeState | Tauri invoke)
        → backend command / HTTP API
```

Фичи потребляют сущности только через публичные экспорты
(`@/entities/...`). Store хранит **wire**-формы как есть (camelCase от
serde, таймстампы в мс); любая UI-форматировка — производное внутри фич.
