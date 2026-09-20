# Спецификация `mai.toml`

Единый конфигурационный файл проекта **Mai**. Лежит в корне приложения
(`app/mai/mai.toml`), читается backend-крейтом `mai-config` и фронтенд-пакетом
`@mai/config`.

Что важно понимать:

- **Схема не типизирована на бэкенде.** Крейт `mai-config` только парсит TOML
  в JSON и отдаёт его как есть. Действительная схема — zod в
  `@mai/config/src/core/schema.ts`; этот документ описывает ту же схему на языке
  данных.
- **Неизвестные ключи не ломают парсинг.** Секции можно расширять заранее —
  старые потребители продолжат работать.

## Структура

```toml
name = "Mai"            # имя проекта
version = "0.1.0"       # версия проекта
description = "..."     # описание проекта

[mode]                  # общие настройки режимов
default = "development" # активный режим
available = [           # доступные режимы (index для секций ниже)
  "development",
  "production",
  "release",
]

[mode.development]      # настройки конкретного режима
debug = true
fake_data = true
hot_reload = true

[mode.production]
debug = false
fake_data = false
hot_reload = false

[mode.release]
debug = false
fake_data = false
hot_reload = false
```

## Топ-уровень

Поля на самом верху — базовые метаданные проекта (без вложенности).

| Ключ | Тип | Обязателен | Описание |
|---|---|---|---|
| `name` | `string` | да | Имя проекта |
| `version` | `string` | да | Версия проекта |
| `description` | `string` | нет | Описание проекта (дефолт: `""`) |

## `[mode]`

| Ключ | Тип | Описание |
|---|---|---|
| `default` | одно из `available` | Активный режим приложения. Обязан присутствовать в `available` |
| `available` | `array` имён | Список режимов; по нему собираются секции `[mode.<имя>]`. Минимум один |

Каждое имя из `available` может иметь свою секцию `[mode.<имя>]`. Отсутствующая
секция даёт настройки по умолчанию (все `false`).

## Общие настройки режима

Поля внутри `[mode.<имя>]` — настройки, применяемые в этом режиме:

| Ключ | Тип | Дефолт | Описание |
|---|---|---|---|
| `debug` | `boolean` | `false` | Режим отладки |
| `fake_data` | `boolean` | `false` | Использовать fake-данные (без бэкенда) |
| `hot_reload` | `boolean` | `false` | Горячая перезагрузка |

Имена в файле — `snake_case` (как в TOML). В zod-схеме они преобразуются в
camelCase (`fakeData`, `hotReload`).

## Итоговый конфиг (что видит фронтенд)

```typescript
interface AppConfig {
  name: string
  version: string
  description: string
  mode: 'development' | 'production' | 'release'   // из [mode].default
  modeConfig: ModeConfig                            // настройки активного режима
  modes: Record<AppMode, ModeConfig>                // настройки всех available
}
```

## Будущие расширения

Схема рассчитана на рост без поломки старого:

1. **Вложенные секции режима** — сервер и БД бэкенда конфигурируются из файла:

   ```toml
   [mode.development.server]
   host = "localhost"
   port = 8000

   [mode.development.database]
   path = "./data/development.db"
   ```

2. **Независимые от режима модули** — общие настройки приложения:

   ```toml
   [application]
   window_width = 1280
   window_height = 800
   ```

Важно: пока бэкенд (БД, сервер) читает **свои** механизмы конфигурации; вынос
в `mai.toml` — открытая идея (см. `docs/roadmap/идеи/config-modes.md`).