# Link — плагин графа связей

Статус: в работе · Приоритет: P2 · Зависимости: —

## Зачем

Материал обучения часто берётся откуда-то, и механизм ссылок фиксирует
источник и связь. Связи нужны между всем, что живёт в приложении, и тем,
что снаружи: ресурс ↔ ресурс, курс ↔ курс, сущность → внешний URI
(сайт, файл, приложение — `vscode://`, `obsidian://`). Граф связей даёт
навигацию: из узла в узел, внутри приложения и наружу.

## Термины

- **Узел** — сущность приложения (resource, course) или внешний URI.
- **Ребро** — направленная связь между двумя узлами (сущность `link`).
- **Граф курса** — все рёбра, порождённые узлами курса.
- **Владелец ребра** — плагин, создавший ребро.

## Модель данных

Ребро:

```
Link {
  id: uuid
  sourceType: 'resource' | 'course'
  sourceId: uuid
  target:
    | { kind: 'resource', courseId, resourceId }
    | { kind: 'course', courseId }
    | { kind: 'uri', uri }
  ownerPluginId: string
  title?, description?
  createdAt, updatedAt        // мс
}
```

При чтении backend добавляет `targetStatus: 'ok' | 'broken'`
(резолв существования цели; `uri` — всегда `ok`).

- **Владение**: ребро принадлежит создавшему плагину (`ownerPluginId`);
  управлять ребром (update/delete) может только владелец, чтение —
  открытое. При создании `ownerPluginId` валидируется по таблице
  `plugins`.
- Источник — только сущность приложения: ребро рождается в контексте
  узла. Курс владельца не денормализуем: выводится из источника
  (resource — из самого ресурса, course — это и есть sourceId).
  Выборка «граф курса» = рёбра курса-источника + рёбра его ресурсов
  (JOIN по `resources`).
- Цели без внешних ключей — резолв при чтении.

## Жизненный цикл рёбер

- **Контракт для gateway-клиентов** (главное правило): «удалил свою
  сущность — вызови Link с удалением её рёбер» (`deleteBySource`).
  Ответственность на владельце источника: не вызвал — рёбра остаются,
  его вина. GC-механизма для plugin-сущностей нет и не планируется.
- **Цель удалена** → ребро остаётся, при чтении помечается `broken`
  (видимо пользователю приглушённо; он решает — починить или удалить).
- **Источник удалён** (course/resource): **sweep** внутри Link перед
  выборкой графа курса проверяет живость источников через **реестр
  резолверов `NodeLiveness`** (только resource и course — core-домены,
  не gateway-клиенты) и удаляет мёртвые рёбра. Sweep — это НЕ общий GC:
  для plugin-сущностей единственный путь — контракт `deleteBySource`.
  Sweep идемпотентен, атомарен, не публикует событий.
- **Плагин-владелец удалён/отключен** — открытый вопрос (read-only или
  удаление рёбер).

## Gateway

Link — провайдер gateway (второй после task, первый с мутациями).
Правило идентичности: **`caller` = `ownerPluginId`** — владелец рёбер
выводится из аутентифицированного `caller`'а запроса, а не из аргументов;
подделать чужое владение нельзя. `caller: "app"` мутации отклоняется
(`forbidden`), чтение — открытое.

Методы (`internal-link`, `plugins/link/gateway.rs` + `gateway_ops.rs`):

- `create { sourceType, sourceId, target, title?, description? }` —
  ребро от имени плагина-caller;
- `update { id, target, title?, description? }` — только владелец;
- `delete { id }` — только владелец;
- `deleteBySource { sourceType, sourceId }` — контрактный: удаляет ВСЕ
  рёбра источника (любого владельца — владение уже удалённым источником
  не проверить), публикует `Deleted` на каждое ребро, идемпотентен;
- read: `listBySource { sourceType, sourceId }`,
  `listBacklinks { target }`, `courseGraph { courseId }` (с sweep).

Ограничение sync: события gateway-мутаций идут с origin=ipc — фронт
их пропускает (считает, что сам обновил сторы), поэтому чужой открытый
LinkViewer не рефрешится вслед за мутациями других плагинов. Учесть
в v2-панелях ссылок; менять механику origin — отдельно.

## Backend

- Модуль плагина `src-tauri/src/plugins/link/` по образцу task:
  `client/commands.rs` (IPC), `service/{data,rules,service,exceptions,liveness}.rs`.
- Репозиторий: trait `database/repository/link.rs`, impl
  `database/sqlite/repositories/link.rs` (+ тесты).
- Миграция `migrations/plugins/link/V20__link.sql`: таблица `links`
  (+CHECK-и, индексы). Без FK и триггеров на чужие таблицы.
- Канал v1 — только Tauri IPC (как task/theory); HTTP-эндпоинты рёбер —
  пункт «HTTP-сервер».
- События: `EntityKind::Link` (`services/events.rs`) + Zod-enum
  (`utils/sync/protocol.ts`) парно, тесты с двух сторон; publish после
  мутаций.
- Регистрация: `plugins/registry.rs` (`internal-link` + тип `link`),
  команды в `invoke_handler` (`lib.rs`).

## Frontend

- Сущность `src/entities/link/` по канону ENTITIES.md: `core/`
  (Zod-схемы — источник истины), `api/` (invoke + fake-ветка),
  `services/`, `store/` (Jotai action atoms); `index.ts` реэкспортирует
  `core` + `store`.
- Sync: `'link'` в `utils/sync/protocol.ts`, applier
  `store/sync.ts`, реестр `app/runner/task/init_events.ts`.

## LinkViewer

Один viewer плагина; внутри — переключатель режимов отображения графа.
Точка входа — ресурс типа `link` в дереве курса.

- Скоуп v1: граф курса целиком (все рёбра по `courseId` из пропсов
  viewer'а). Подграфы/фильтры — v2.
- Режим v1: граф-визуализация — `@xyflow/react` + раскладка `elkjs`.
  Архитектура режимов заложена сразу; список/таблица — v2.
- Управление рёбрами из viewer'а: создание (выбор цели: ресурс, курс
  или URI), правка, удаление — с `ownerPluginId: 'internal-link'`.
- Переход по ребру: внутренняя цель → `navigate()` на роут
  (`/course/:courseId`, `/course/:courseId/resource/:resourceId`);
  `uri` → `tauri-plugin-opener` (уже подключён, permission
  `opener:default`).

## Регистрация

- Rust: запись `InternalPluginEntry { id: "internal-link", …,
  resource_types: [key: "link"] }` в `register_internal_plugins()`
  (`src-tauri/src/plugins/registry.rs`) — инициализатор при старте сам
  создаст плагин в `plugins`/`internal_plugins` и тип в `resource_types`.
- Frontend: `INTERNAL_VIEWERS.link = LinkViewer`
  (`src/features/plugin/registry.ts`); компонент в `src/plugins/link/`
  по контракту PLUGINS.md (корень: `viewer.tsx`, `index.ts`, `core/`).

## Границы версий

- **v1** — рёбра (CRUD + владение), sweep (resource/course), LinkViewer:
  граф курса, граф-визуализация, переходы; регистрация типа `link`; канал IPC.
- **v2** — Plugin Gateway: провайдер link (контракт `deleteBySource`,
  владелец — единственный управляющий, `caller` = `ownerPluginId`),
  панели ссылок в контексте узла (ресурс/курс), режимы список/таблица,
  вставка рёбер в theory (TipTap), копирование `mai://`-ссылок,
  HTTP-эндпоинты.
- **Идеи (P3)** — автодетект приложений в системе, deep-linking
  (`mai://` из ОС), граф всех курсов, wiki-автоссылки,
  lifecycle-подписка плагинов на события сущностей (кандидат в Gateway).

## Решённые вопросы

- Библиотека графа: `@xyflow/react` + `elkjs`.
- URI-валидация: непустой, схема обязательна
  (`^[a-zA-Z][a-zA-Z0-9+.-]*:.+`), ≤2048 символов; белый список схем не
  вводим — opener отдаёт в систему.
- Межкурсовые рёбра: разрешены (цель не ограничивается курсом
  источника).

## Открытые вопросы

- Поведение рёбер при удалении/отключении плагина-владельца (read-only
  или удаление).
- Поведение на очень больших графах (лимиты, агрегация) — по факту
  эксплуатации.

## Прогресс

- [x] Проработка концепции
- [x] Backend: `plugins/link/`, миграция V20, реестр резолверов, IPC, EntityKind
- [x] Frontend: `entities/link/`, sync-контракт
- [x] LinkViewer + регистрация
- [x] Смоук (Pilot a1: тип в TypePicker → LinkViewer → рёбра курс→URI и
      курс→ресурс → граф-визуализация → «Перейти» → broken после удаления
      цели → удаление ребра)
- [x] Gateway-провайдер: методы (create/update/delete/deleteBySource +
      read), `caller` = `ownerPluginId`, код `forbidden`, общий
      `build_service`, сервисный `delete_source_links` + тесты
