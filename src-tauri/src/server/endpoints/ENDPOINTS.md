# ENDPOINTS — HTTP API (`src-tauri/src/server/endpoints`)

Соглашения реализации HTTP-эндпоинтов. Слой поверх service layer: Tauri-команды
(`client/command/`) и HTTP-эндпоинты зовут **одни и те же сервисы** — бизнес-логика
живёт только в `services/`. Swagger: `/docs` (utoipa + Swagger UI, `openapi.rs`).

## Структура каталога

Домен = папка: `router.rs` + один файл на операцию (`create.rs`, `update.rs`, …).
Вложенные группы — подпапки (`structure/node/`, `structure/directory/`).

Три точки регистрации нового домена/эндпоинта:

1. `endpoints/mod.rs` — объявление модуля;
2. `server/router.rs` — `nest("/<prefix>", endpoints::<domain>::router())`;
3. `openapi.rs` — `paths(...)` + `components(schemas(...))` + `tags(...)`.

## Шаблон эндпоинта

```rust
#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateXRequest { /* camelCase-поля */ }

#[utoipa::path(
    post,
    path = "/xs",
    request_body = CreateXRequest,
    tag = "xs",
    operation_id = "create_x",
    responses(
        (status = 201, description = "Created", body = XData),
        (status = 400, description = "Validation error")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Json(body): Json<CreateXRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteXRepository::new(state.pool.clone()));
    let service = XService::new(state.app_paths.clone(), repo, state.publisher.clone());

    match service.create(/* ... */).await {
        Ok(x) => (StatusCode::CREATED, Json(serde_json::json!(x))),
        Err(err) => map_error(err),
    }
}
```

Правила:

- Состояние — только `State<AppState>` (`server/state.rs`): `pool`, `app_paths`,
  `publisher` (скоуп http). Репозитории — `Arc<Sqlite…Repository>` per-request.
- Request/response — serde `camelCase` (как отдаёт фронтенду Zod-слой);
  структуры запросов/ответов — `ToSchema` и в `openapi.rs`.
- Сервисы — нормализация → валидация → use-case; эндпоинт валидацию не дублирует.
- Ошибки — только через `map_error` сервиса: `NotFound` → 404, `Validation` → 400,
  `Conflict`/`AlreadyExists` → 409, `Internal` → 500. Функция живёт в роутере
  домена (см. `structure/router.rs`); для вложенных групп — `super::super::router::map_error`.
- Норма — один файл ~60–80 строк; больше — признак того, что логика уехала в эндпоинт.

## Обязательно: события синхронизации

Каждая мутация данных доезжает до UI через событийную шину — механизм описан в
`app/mai/src/entities/SYNC.md`. Требования к эндпоинтам:

1. **Любой мутирующий эндпоинт** передаёт `state.publisher.clone()` (origin=http)
   в конструктор сервиса. Публикация — **в сервисе после успешной мутации**,
   не в эндпоинте: эндпоинт только поставляет паблишер.
2. **Чтения не публикуют** ничего.
3. id/courseId для события берутся из валидированных значений (после rules-проверок),
   до/после ФС-операций — по образцу существующих сервисов.
4. **Новая сущность** = правка контракта парно:
   - `EntityKind` в `services/events.rs` + контрактный тест в `utils/events.rs`;
   - Zod-enum в `app/mai/src/entities/sync/protocol.ts` + тест маршрута в
     `app/mai/src/entities/sync/dispatcher.test.ts`.
   Rust и Zod меняются одним коммитом — расхождение = потерянные события во фронте.
5. **Фронт-часть новой сущности**: applier в `src/entities/<name>/store/sync.ts`
   (refetch штатными load-атомами) + маршрут в `src/entities/sync/dispatcher.ts`.
6. Стартап-инициализация (когда слушателей ещё нет) публикует через `NoopPublisher`
   (см. `plugins/initializer.rs`) — события наружу не идут.

## Чек-лист: новый эндпоинт существующего домена

- [ ] файл операции в папке домена + маршрут в `<domain>/router.rs`
- [ ] регистрация в `openapi.rs` (path + схемы запроса/ответа)
- [ ] `State<AppState>`, репозитории из `state.pool`, сервис из `state.app_paths`
- [ ] мутирующий → `state.publisher.clone()` в конструктор сервиса
- [ ] request/response: serde camelCase + `ToSchema`
- [ ] ошибки — через `map_error` домена
- [ ] `cargo fmt && cargo check && cargo clippy && cargo test`

## Чек-лист: новый домен

- [ ] сервис: `data.rs` / `rules.rs` / `service.rs` / `exceptions.rs` (+ repository trait + sqlite impl)
- [ ] `EntityKind` (`services/events.rs`) + Zod-enum (`entities/sync/protocol.ts`) — парно, тесты с двух сторон
- [ ] `publisher: SharedChangePublisher` в конструкторе сервиса, publish после каждой мутации
- [ ] фронт: applier `store/sync.ts` + маршрут `entities/sync/dispatcher.ts`
- [ ] папка эндпоинтов: `router.rs` + операции + регистрация (см. «Структура каталога»)
- [ ] тег в `openapi.rs`
