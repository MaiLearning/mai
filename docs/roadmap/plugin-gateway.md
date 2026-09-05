# Plugin Gateway — шлюз плагина

Статус: в работе · Приоритет: P1 · Зависимости: —

## Зачем

Шлюз с методами, который плагин (любого вида — internal или external)
открывает для взаимодействия с ним: так плагины обращаются между собой
и вызывают функции друг друга. Интерфейс единый для обоих видов,
проектируется один раз. От него зависят [Link](./link-plugin.md) и
[External-плагины](./external-plugins.md).

Скоуп — только плагин ↔ плагин. HTTP-доступ внешних клиентов (агентов)
к функциональности плагинов — скоуп [HTTP-сервера](./http-server.md).

Не путать с [External Plugin API](./external-plugin-api.md) — это средства,
которые приложение предоставляет внешним плагинам (обратное направление).

## Что делаем

### Транспорт — Rust-брокер

Вызовы идут через Tauri IPC: `plugin_gateway_call` → диспетчер в Rust →
обработчик плагина. Ядро — `src-tauri/src/plugins/gateway/`:

- `data.rs` — wire-контракт: `GatewayManifest` (перечень методов плагина),
  `GatewayCallRequest { pluginId, method, args, caller }`, структурированная
  ошибка `GatewayError { code, message }`.
- `support.rs` — общие хелперы обработчиков (`parse_args`, `to_value`);
  своих копий в плагинах не заводить.
- `registry.rs` — статические манифесты всех плагинов (аналог
  `InternalPluginEntry`); источник для дискавери и различения
  `pluginNotFound` / `methodNotFound`.
- `dispatch.rs` — маршрутизация: match `(plugin_id, method)` → обработчик;
  аргументы разбираются типизированной структурой на каждый метод.
- `commands.rs` — Tauri-команды `plugin_gateway_call` и
  `plugin_gateway_manifests` (дискавери).

Frontend-клиент — `src/features/plugin/gateway/` (`callGateway`,
`fetchGatewayManifests`): тонкая обёртка над invoke, ответ валидируется
Zod-схемой потребителя (wire-схемы переиспользуются из сущностей, например
`TaskSnapshotDataSchema` из `@/entities/task-plugin`).

### Первый кейс — данные task для аналитики

Task-плагин (`src-tauri/src/plugins/task/gateway/`) открывает read-методы:

- `snapshot { resourceId }` → полный снапшот контента task-ресурса
  (`TaskSnapshotData`: задачи, сложности, ответы пользователя, результаты,
  completed);
- `attempts { taskId }` → история попыток задачи (`TaskAttemptData[]`).

Плагин в gateway: `internal-task`. Идентификатор caller'а — id плагина
или `"app"`.

### Link — первый провайдер мутаций

Link-плагин (`src-tauri/src/plugins/link/gateway/`) открывает мутации
и чтение графа (`internal-link`):

- мутации: `create`, `update`, `delete`, контрактный `deleteBySource`
  («удалил свою сущность — удали её рёбра»);
- read: `listBySource`, `listBacklinks`, `courseGraph`;
- правило идентичности: **`caller` = `ownerPluginId`** — владелец выводится
  из caller'а, не из args; `"app"` мутации отклоняется (код `forbidden`,
  добавлен в `GatewayErrorCode`).
- Для мутаций диспетчер пробрасывает в обработчики publisher (события
  изменений) и caller; команда `plugin_gateway_call` получает
  `State<ChangePublishers>` и передаёт ipc-скоуп.

Детали жизненного цикла рёбер: [link-plugin.md](./link-plugin.md).

### Открытие методов нового плагина

Весь gateway-код плагина — в каталоге `plugins/<plugin>/gateway/`:

1. `manifest.rs` — **стандартный файл у всех плагинов**: константа
   `PLUGIN_ID`, константы `METHOD_*`, `manifest() -> GatewayManifest`.
2. `handlers.rs` — обработчики методов, Args-структуры, маппинг ошибок
   сервиса в `GatewayError`.
3. `args.rs` — опционально, если Args-структур много (как у link).
4. `mod.rs` — декларации + re-exports: `registry.rs`/`dispatch.rs` зовут
   только `<plugin>::gateway::{PLUGIN_ID, METHOD_*, manifest, ...}` —
   имена внутренних файлов не протекают.
5. `runtime.rs` рядом с `gateway/` — `build_service`, единственная
   фабрика сервиса плагина: её зовут и IPC-команды, и gateway-обработчики.
6. Манифест — в `gateway/registry.rs`, ветки маршрутизации — в
   `gateway/dispatch.rs`.
7. Frontend-потребители зовут `callGateway(Schema, pluginId, method, args)`.

## Решения по открытым вопросам

- **Транспорт**: Rust-брокер. Диспетчер переиспользуем позже для
  HTTP-сервера (внешние агенты) и external-плагинов — оба транспорта
  заводятся на тот же `dispatch`, без изменения интерфейса.
- **Реестр/дискавери**: статические манифесты в Rust + команда
  `plugin_gateway_manifests`. External-плагины (P3) добавят динамическую
  регистрацию в тот же реестр.
- **Версионирование**: `version` в манифесте, без переговоров. Жёсткие
  проверки понадобятся только с external-плагинами.
- **Права**: вне скоупа до [data-rights](./data-rights.md) (P3), но поле
  `caller` в запросе уже передаётся — базис для будущих проверок.

## Прогресс

- [x] Ядро `plugins/gateway/` (data, registry, dispatch, commands) + тесты
- [x] Task-gateway: `snapshot`, `attempts`
- [x] Frontend-клиент `features/plugin/gateway/` + тесты
- [x] Link-провайдер: мутации + контрактный `deleteBySource` + read,
      `caller` = `ownerPluginId`
- [ ] Потребители (аналитика, панели ссылок) — по мере появления
