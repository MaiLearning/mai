# @mai/config

Единый конфиг проекта **Mai**: один файл `mai.toml` в корне приложения, который
читают и фронтенд, и бэкенд. Этот пакет — фронтенд-сторона: он отдаёт остальным
пакетам типизированный конфиг и следит за изменением файла.

## Зачем

Раньше конфигурация была разнесена: `config/*.conf`, виртуальный модуль
`virtual:mai-config`, режим приложения хардкодился в `Runner`. Теперь всё в одном
месте. Другие пакеты **не читают `mai.toml` сами** — только через `@mai/config`.

## Как это работает

| Слой | Ответственность |
|---|---|
| `src-tauri/crates/mai-config` | backend-крейт: читает `mai.toml`, следит через `notify`, отдаёт по IPC-команде `config_get`, шлёт событие `config://changed` |
| `src/packages/config` | этот пакет: `invoke` + `listen`, валидация zod, jotai-атом |

Файл не типизирован целиком на бэкенде: `mai-config` отдаёт raw JSON, а
SQLite-конфигурация валидируется backend-адаптером при старте. Полная
frontend-схема живёт здесь, в `core/schema.ts` (zod).

## Как пользоваться

Инициализация один раз на старте (runner-таска `initConfigTask`):

```typescript
import { getAppConfig, initAppConfig, useAppConfig } from '@mai/config'

await initAppConfig()               // первичное чтение + подписка на изменения

// В React-компоненте — подписка автоматически:
const config = useAppConfig()       // AppConfig
```

Вне React:

```typescript
import { getAppConfig } from '@mai/config'

const { mode, modeConfig } = getAppConfig()
if (modeConfig.fakeData) { /* включить fake-данные */ }
console.log(modeConfig.database.path)
```

### API

| Функция | Описание |
|---|---|
| `initAppConfig()` | первичная загрузка `config_get` + активация подписки на `config://changed`. Бэкенда нет (Storybook) — фолбэк на `defaultConfig` |
| `getAppConfig()` | текущий конфиг (после инициализации) |
| `useAppConfig()` | React-хук: текущий конфиг, обновляется при изменении файла |
| `appConfigAtom` | jotai-атом конфига |

## Разработка

- Схема: `src/core/schema.ts` (zod). Зеркалит `docs/SPEC.md`.
- База данных: `mode.<профиль>.database`; `path` разрешается от `app_data_dir`.
- Дефолты: `src/core/defaults.ts`.
- Транспорт: `src/api/` (invoke/listen), не экспортируется наружу.
- Тесты: `vitest` (`schema.test.ts`, `configStore.test.ts`).

```bash
pnpm --filter @mai/<другой-пакет> add @mai/config --workspace
```

## Связанное

- Спецификация файла: `docs/SPEC.md`.
- Backend-крейт: `src-tauri/crates/mai-config`.
- Значение файла конфигурации: `mai.toml` в корне `app/mai`.