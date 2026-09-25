# Спецификация `mai.toml`

Единый конфигурационный файл проекта **Mai**. Лежит в корне приложения
(`app/mai/mai.toml`), читается backend-крейтом `mai-config` и фронтенд-пакетом
`@mai/config`.

Что важно понимать:

- **Крейт `mai-config` не типизирует весь конфиг.** Он только парсит TOML
  в JSON и отдаёт его как есть. Zod-схема фронтенда находится в
  `@mai/config/src/core/schema.ts`; backend-потребитель SQLite извлекает и
  проверяет свою секцию `mode.<имя>.database` отдельно.
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

[mode.development.database]
path = ".dev/mai_dev.db"
max_connections = 5

[mode.production]
debug = false
fake_data = false
hot_reload = false

[mode.production.database]
path = "storage/mai.db"
max_connections = 5

[mode.release]
debug = false
fake_data = false
hot_reload = false

[mode.release.database]
path = "storage/mai.db"
max_connections = 5
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

Каждое имя из `available` должно иметь секцию `[mode.<имя>]` с обязательным
блоком `database`. Булевы настройки секции могут отсутствовать и получают
значение `false`.

## Общие настройки режима

Поля внутри `[mode.<имя>]` — настройки, применяемые в этом режиме:

| Ключ | Тип | Дефолт | Описание |
|---|---|---|---|
| `debug` | `boolean` | `false` | Режим отладки |
| `fake_data` | `boolean` | `false` | Использовать fake-данные (без бэкенда) |
| `hot_reload` | `boolean` | `false` | Горячая перезагрузка |

Имена в файле — `snake_case` (как в TOML). В zod-схеме `fake_data` и
`hot_reload` преобразуются в `fakeData` и `hotReload`.

## Настройки базы данных

Блок `[mode.<имя>.database]` обязателен для каждого режима из `available`:

| Ключ | Тип | Обязателен | Описание |
|---|---|---|---|
| `path` | `string` | да | Путь к файлу SQLite. Относительный путь разрешается от `app_data_dir` |
| `max_connections` | положительное целое число | да | Максимальное число соединений в пуле |

Backend выбирает секцию по профилю сборки: debug использует `development`,
release — `release`. Конфигурация БД считывается при запуске; изменение файла
через watcher обновляет frontend, но для применения новой БД приложение нужно
перезапустить.

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

## Расширения

Схема рассчитана на рост без поломки старого:

1. **Серверная конфигурация** — секция сервера пока остаётся отдельной задачей:

   ```toml
   [mode.development.server]
   host = "localhost"
   port = 8000
   ```

2. **Независимые от режима модули** — общие настройки приложения:

   ```toml
   [application]
   window_width = 1280
   window_height = 800
   ```

База данных уже читается backend при старте из `mode.<профиль>.database`.
Изменения файла не пересоздают SQLite-пул автоматически.