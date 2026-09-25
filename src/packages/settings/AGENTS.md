# Пакет @mai/settings

Пользовательские настройки приложения: чтение/запись self-describing документов
(домен + пункт), общий стор значений и рендер формы по Zod-схеме определения.
Не путать с конфигом приложения (`@mai/config`, `mai.toml`) и сервисным
хранилищем (`@mai/kv`).

## Модель данных

- **Пункт** — пара `(domain, itemId)`: `system` → `general`, `plugin` → `pluginId`,
  `course` → `courseId`. Ключ состояния — `domain:itemId` (`settingsStateKey`).
- **Документ пункта** (`SettingsDocument`) — то, что хранит бэкенд:
  `settings: { [поле]: SettingsField }`, где поле = `{ type, params?, default?, value }`.
  Типы полей — реестр схем Rust (`src-tauri/src/services/settings/schemas`),
  значения валидирует бэкенд.
- **Определение** (`definePluginSettings`) — Zod-схема + `jsonSchema`
  (`z.toJSONSchema`, draft-07) + `defaults` (`schema.parse({})`) + `i18nNamespace`
  и опциональные `nameKey` / `descriptionKey`.
- Дефолты живут только в определении; в БД пункт появляется при первом изменении.

## Поток данных

1. `useSettingsValues(definition, domain, itemId)` → `loadSettingsDocument`:
   `settings_get` → `parseSettingsDocument` → `documentToValues` (значения из документа,
   недостающие — из дефолтов; документ, несовместимый со схемой, даёт дефолты + ошибку
   и остаётся сбрасываемым).
2. Значения правятся `setValue` (сразу в стор, запись — после паузы
   `SETTINGS_AUTOSAVE_DELAY`) или `saveValues` (немедленно).
3. `valuesToSettings` собирает self-describing payload → `settings_update` (полная замена
   документа) → итоговый документ снова адаптируется в значения.
4. `reset` → `settings_delete` → документ из дефолтов.

## Рендер формы

`SettingsSchemaForm` — единственная форма и для системных «Общих», и для плагинов:

- `settingsFieldSpecs(definition, values)` (core) отдаёт по каждому свойству JSON Schema
  self-describing `SettingsField` плюс ключи переводов;
- ключи (отсчёт от `i18nNamespace` определения): подпись — `title` из схемы или
  `<поле>.label`, пояснение — `description` или `<поле>.hint`, варианты выбора —
  `<поле>.options.<значение>`. Эвристик по строкам переводов нет: ключ либо объявлен,
  либо перевода нет;
- `SettingsFieldRenderer` выбирает контрол по `field.type`. Контролы о переводах не знают:
  подписи вариантов приходят готовой картой `labels`.

## Инварианты

- Публичный вход — `src/index.ts`: `definePluginSettings`, `systemSettingsDefinition`,
  `useSettingsValues`, системные атомы (`settingsReadyAtom`, `systemThemeAtom`,
  `systemLanguageAtom`), UI-компоненты. Плагины читают настройки через
  `usePluginSettings` из `@mai/plugin`.
- Состояние по ключу `domain:itemId` одно на всех потребителей: форма настроек и viewer
  плагина видят одни значения.
- Тема и язык берутся из значений пункта (`systemThemeAtom` / `systemLanguageAtom`),
  а не из документа: правка видна сразу, до сохранения.
- Загрузка дедуплицируется, записи по одному ключу сериализуются; подпись определения
  в состоянии отделяет значения текущей схемы от устаревших.
- Никаких прямых HTTP-вызовов — только IPC через `api/*` (`settings_get/update/delete`).
- Ошибки I/O не бросаются в UI: они попадают в состояние и показываются статусом формы.

## Проверка

- `pnpm exec vitest run src/packages/settings` — unit-тесты core и стора
  (vitest работает в node-окружении и видит только `*.test.ts`).
- `pnpm exec tsc --noEmit` — типы приложения и stories.
- UI — в Storybook: `Settings/SchemaForm`, `Settings/Field/*`, `Pages/Settings/*`.
