# client/ — Tauri IPC команды

Модуль `client` содержит команды для взаимодействия с фронтендом (TS/React) через Tauri IPC (`invoke`).

## Концепция

В проекте два канала взаимодействия с backend-логикой:

- **`server/`** — HTTP endpoints (axum) для внешних агентов/интеграций
- **`client/`** — Tauri команды для GUI (через `#[tauri::command]`)

Оба используют один и тот же слой `services/` и `database/`. Разница только в транспорте.

## Структура

```
client/
├── client.md          # этот файл
└── command/
    ├── mod.rs
    ├── health.rs      # GET /health
    ├── course.rs      # CRUD курсов
    ├── resource.rs    # CRUD ресурсов
    ├── structure.rs   # дерево структуры
    └── theory.rs      # CRUD теории
```

## Правила

1. Каждая команда — отдельный файл в `command/`
2. Команды регистрируются в `lib.rs` через `generate_handler![]`
3. Команды не содержат бизнес-логики — только вызов `services/` и маппинг ответа
4. Типы ответов дублировать не нужно — использовать уже существующие из `services/`
